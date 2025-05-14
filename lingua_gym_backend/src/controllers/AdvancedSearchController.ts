import { Request, Response } from "express";
import { container } from "tsyringe";
import { AdvancedSearchService } from "../services/advanced_search/AdvancedSearchService.js";
import logger from "../utils/logger/Logger.js";
import { AdvancedSearchResult } from "../services/advanced_search/AdvancedSearchService.js";

interface SearchData {
    items: SearchDataItem[],
    totalCount: number
}

type SearchDataItem = {
    id: string;
    name: string;
    description?: string | null;
    filters: Filters;
}

interface Filters {
    time?: Date | null;
    materialType: string;
    language: string;
    tags: string[];
    users: string[];
}

const advancedSearchController = async (req: Request, res: Response) => {
    try {
        const {
            value,
            type,
            language,
            users,
            tags,
            limit = 20,
            offset = 0
        } = req.query;

        const searchService: AdvancedSearchService = container.resolve(AdvancedSearchService);

        const results: (AdvancedSearchResult) = await searchService.performSearch(
            {
                value: typeof value === "string" ? value : undefined,
                type: typeof type === "string" ? type : undefined,
                language: typeof language === "string" ? language : undefined,
                users: Array.isArray(users) 
                    ? (users as string[]) 
                    : typeof users === "string" 
                    ? [users] 
                    : undefined,
                tags: Array.isArray(tags) 
                    ? (tags as string[]) 
                    : typeof tags === "string" 
                    ? [tags] 
                    : undefined
            },
            Number(limit),
            Number(offset)
        );

        const data: SearchData = { items: [], totalCount: 0 };

        results.items.forEach((result) => {
            if (result.dictionarySetId !== undefined) {
                data.items.push({
                    id: result.dictionarySetId,
                    name: result.name,
                    description: result.description,
                    filters: {
                        time: result.createdAt,
                        materialType: 'Set',
                        language: result.languageCode,
                        tags: result.tags,
                        users: [result.ownerName]
                    }
                });
            }
        });

        data.totalCount = results.totalCount;

        res.status(200).json({ ...data });
    } catch (err) {
        logger.error("Advanced search controller error:", err);
        res.status(500).json({ error: "Internal server error during advanced search." });
    }
};

export default advancedSearchController;