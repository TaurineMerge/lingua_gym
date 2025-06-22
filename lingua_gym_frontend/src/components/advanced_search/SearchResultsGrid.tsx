import { Grid, Box, Pagination, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce";
import SearchCard from "./SearchCard";
import useAxiosWithTotalPageCount from "../../hooks/api/UseAxiosWithTotalPageCount";

interface SearchResultData {
  items: GridCardData[];
  totalCount: number;
}

interface SearchResultsGridProps {
  isSmall: boolean;
  searchQuery: string;
  filters: Filters;
}

interface Filters {
  time: string;
  rating: string;
  materialType: string;
  language: string;
  tags: string[];
  users: string[];
}

interface GridCardData {
  id: number;
  name: string;
  description: string;
  filters: Filters;
}

const SearchResultsGrid = ({ isSmall, searchQuery, filters }: SearchResultsGridProps) => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [debouncedFilters] = useDebounce(filters, 300);

  const getMatchScore = (name: string, search: string): number => {
    if (name === search) return 100;
    if (name.startsWith(search)) return 75;
    if (name.includes(search)) return 50;
    return 0;
  };

  const { data, totalCount, loading, error, execute } = useAxiosWithTotalPageCount<SearchResultData>({
    url: "http://localhost:3000/api/advanced_search/search",
    method: "get",
    manual: true,
    withCredentials: true,
  });

  useEffect(() => {
    if (!debouncedQuery.trim() && !debouncedFilters.materialType && !debouncedFilters.language && debouncedFilters.users.length === 0 && debouncedFilters.tags.length === 0) {
      execute({ params: { limit: itemsPerPage, offset: (page - 1) * itemsPerPage } }).catch(err => {
        console.error("Initial fetch failed:", err);
      });
      return;
    }
  
    const params = {
      value: debouncedQuery,
      type: debouncedFilters.materialType || undefined,
      language: debouncedFilters.language || undefined,
      users: debouncedFilters.users.length > 0 ? debouncedFilters.users : undefined,
      tags: debouncedFilters.tags.length > 0 ? debouncedFilters.tags : undefined,
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
    };

    execute({ params }).catch(err => {
      console.error("Search request failed:", err);
    });
  }, [debouncedQuery, debouncedFilters, execute, page]);  

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, debouncedFilters]);

  const gridCards = useMemo(() => {
    if (!data?.items) return [];
    return data.items;
  }, [data]);

  const filteredAndSorted = useMemo(() => {
    if (!gridCards.length) return [];

    const lowerSearch = debouncedQuery.toLowerCase();

    return gridCards
      .sort((a, b) => {
        const scoreDiff = getMatchScore(b.name.toLowerCase(), lowerSearch) - getMatchScore(a.name.toLowerCase(), lowerSearch);
        if (scoreDiff !== 0) return scoreDiff;

        const dateA = new Date(a.filters.time).getTime();
        const dateB = new Date(b.filters.time).getTime();

        if (debouncedFilters.time === "newest") return dateB - dateA;
        if (debouncedFilters.time === "oldest") return dateA - dateB;

        return 0;
      });
  }, [debouncedQuery, gridCards, debouncedFilters]);

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between" minHeight="100%">
      <Grid container spacing={2} minHeight="90%">
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box color="error.main" textAlign="center" width="100%">
            Error fetching data: {error.message}
          </Box>
        )}

        {!loading && !error && filteredAndSorted.length === 0 && (
          <Box width="100%" textAlign="center" mt={4}>
            <Typography variant="body1">Nothing found 🧐</Typography>
          </Box>
        )}

        {filteredAndSorted.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.id}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              layout
            >
              <SearchCard
                index={card.id}
                title={card.name}
                description={card.description}
                materialType={card.filters.materialType}
                language={card.filters.language}
                tags={card.filters.tags}
                time={card.filters.time}
                rating={'5'}
                access="Публичный"
                users={card.filters.users}
                isSmall={isSmall}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {!loading && !error && filteredAndSorted.length > 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" p={2} minHeight="10%">
          <Pagination
            count={Math.max(1, Math.ceil(totalCount / itemsPerPage))}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            showFirstButton
            showLastButton
            size={isSmall ? "small" : "medium"}
            siblingCount={isSmall ? 0 : 1}
            sx={{
              "& .MuiPaginationItem-root": {
                color: theme.palette.text.primary,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default SearchResultsGrid;
