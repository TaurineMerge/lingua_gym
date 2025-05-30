import { Box, ToggleButtonGroup, Container, Divider, Fab, FormControl, IconButton, InputBase, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, Paper, Select, Stack, ToggleButton, Typography, Chip, Avatar, Skeleton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import theme from "../theme";
import { useState } from "react";

const Library = () => {
	const [alignment, setAlignment] = useState<string | null>('sets');
	const [loading, setLoading] = useState(false);

	const handleAlignment = (
		event: React.MouseEvent<HTMLElement>,
		newAlignment: string | null,
	) => {
		setAlignment(newAlignment);
	};

	const items = [
		{ id: 1, name: "React Fundamentals", type: "set", author: "John Doe", date: "2023-05-15", tags: ["React", "Frontend"] },
		{ id: 2, name: "Advanced TypeScript", type: "text", author: "Jane Smith", date: "2023-06-20", tags: ["TypeScript"] },
		{ id: 3, name: "CSS Masterclass", type: "set", author: "Mike Johnson", date: "2023-04-10", tags: ["CSS", "Design"] },
	];

	return (
		<Container>
			<Box mt={4} display="flex" alignItems="center" justifyContent="space-between">
				<Typography variant="h3" sx={{ 
				color: theme.palette.secondary.main, 
				fontWeight: theme.typography.h3.fontWeight,
				lineHeight: theme.typography.h3.lineHeight,
				fontSize: theme.typography.h3.fontSize
				}}>
					Библиотека
				</Typography>
				<Fab color="primary" aria-label="add" size="medium">
					<AddIcon />
				</Fab>
			</Box>
			<Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} m={2} spacing={{ xs: 0.25, sm: 0.5, md: 0.75, lg: 1 }}>
				<ToggleButtonGroup
					color="primary"
					value={alignment}
					exclusive
					sx={{ backgroundColor: '#111', color: '#EEE' }}
					onChange={handleAlignment}
					aria-label="Platform"
					>
					<ToggleButton value="sets" sx={{ fontSize: '1rem', borderRadius: '1' }}>Сеты</ToggleButton>
					<ToggleButton value="texts" sx={{ fontSize: '1rem', borderRadius: '1' }}>Тексты</ToggleButton>
				</ToggleButtonGroup>
				<Box display="flex" gap={1}>
					<FormControl>
						<InputLabel 
						id="demo-simple-select-label" 
						variant="outlined" 
						sx={{
						'&.MuiInputLabel-shrink':{
							color:'#EEE'
						}}}>
							Язык
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={1}
							label="Фильтр"
							onChange={() => {}}
						>
							<MenuItem value={1}>Русский</MenuItem>
							<MenuItem value={2}>Английский</MenuItem>
							<MenuItem value={3}>Китайский</MenuItem>
						</Select>
					</FormControl>
					<FormControl>
						<InputLabel 
						id="demo-simple-select-label" 
						variant="outlined" 
						sx={{
						'&.MuiInputLabel-shrink':{
							color:'#EEE'
						}}}>
							Сортировка
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={3}
							label="Сортировка"
							onChange={() => {}}
						>
							<MenuItem value={1}>Сначала новые</MenuItem>
							<MenuItem value={2}>Сначала старые</MenuItem>
							<MenuItem value={3}>По алфавиту</MenuItem>
						</Select>
					</FormControl>
					<FormControl>
						<InputLabel 
						id="demo-simple-select-label" 
						variant="outlined" 
						sx={{
						'&.MuiInputLabel-shrink':{
							color:'#EEE'
						}}}>
							Фильтр
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={3}
							label="Фильтр"
							onChange={() => {}}
						>
							<MenuItem value={1}>Только мои</MenuItem>
							<MenuItem value={2}>Чужие</MenuItem>
							<MenuItem value={3}>Все</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<Paper
				component="form"
				sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, bgcolor: '#1A1A1A' }}
				>
					<InputBase
						sx={{ ml: 1, flex: 1, height: '3rem' }}
						placeholder="Введите название"
						inputProps={{ 'aria-label': 'search' }}
					/>
					<SearchIcon />
				</Paper>
			</Stack>
			<Divider variant="middle" color="#0A84FF"></Divider>
			<Paper sx={{ 
				overflow: 'hidden',
				backgroundColor: '#111'
			}}>
				{loading ? (
				Array(3).fill(0).map((_, index) => (
					<Skeleton key={index} variant="rectangular" height={72} />
				))
				) : (
				<List sx={{ p: 0 }}>
					{items.map((item) => (
					<div key={item.id}>
						<ListItem
						secondaryAction={
							<IconButton 
							edge="end" 
							aria-label="delete"
							>
								<DeleteIcon />
							</IconButton>
						}
						sx={{
							'&:hover': {
								backgroundColor: '#1A1A1A',
							}
						}}
						>
							<ListItemButton sx={{ py: 0.2, '&:hover': { backgroundColor: 'transparent' }}}>
								<Avatar sx={{ 
									mr: 2, 
								}}>
									{item.type === 'set' ? 'S' : 'T'}
								</Avatar>
								<Box display={'flex'} flexDirection={'row'} alignItems={'center'} sx={{ flexGrow: 1 }}>
									<ListItemText
										primary={
											<Typography variant="subtitle1" color="#fff" fontWeight={500}>
												{item.name}
											</Typography>
										}
										secondary={
											<>
												<Typography 
												component="span" 
												variant="body2" 
												color="text.primary"
												sx={{ mr: 1, fontSize: '0.875rem' }}
												>
													{item.author}
												</Typography>
												<Typography 
												component="span" 
												variant="body2" 
												color="text.primary"
												sx={{ fontSize: '0.875rem' }}
												>
													• {new Date(item.date).toLocaleDateString()}
												</Typography>
											</>
										}
									/>
									<Box>
										{item.tags.map((tag) => (
										<Chip 
											key={tag} 
											label={tag} 
											size="small" 
											sx={{ mr: 1, mt: 0.5 }} 
										/>
										))}
									</Box>
									<Box>
										<Chip 
											label='ru' 
											size="small" 
											sx={{ mr: 1, mt: 0.5, backgroundColor: '#111' }} 
										/>
									</Box>
								</Box>
							</ListItemButton>
						</ListItem>
						<Divider variant="middle" />
					</div>
					))}
				</List>
				)}
			</Paper>
		</Container>
	);
};

export default Library;