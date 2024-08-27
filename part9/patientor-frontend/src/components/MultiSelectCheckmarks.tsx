import {
	Box,
	Checkbox,
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
	SelectChangeEvent,
} from "@mui/material";

interface MultiSelectCheckmarksProps {
	state: string[];
	setState: (e: SelectChangeEvent<string[]>) => void;
	items: string[];
	label: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const MultiSelectCheckmarks = ({
	label,
	items,
	state,
	setState,
}: MultiSelectCheckmarksProps) => {
	return (
		<Box
			maxWidth={"12rem"}
			marginTop={"1rem"}
		>
			<FormControl fullWidth>
				<InputLabel id={`${label}-label`}>{label}</InputLabel>
				<Select
					labelId={`${label}-label`}
					id={`${label}-checkbox`}
					multiple
					value={state}
					onChange={setState}
					input={<OutlinedInput label={label} />}
					renderValue={(selected) => selected.join(", ")}
					MenuProps={MenuProps}
				>
					{items.map((item) => (
						<MenuItem
							key={item}
							value={item}
						>
							<Checkbox checked={state.includes(item)} />
							<ListItemText primary={item} />
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
};
export default MultiSelectCheckmarks;
