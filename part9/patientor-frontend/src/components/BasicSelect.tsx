import {
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";

interface BasicSelectProps {
	label: string;
	items: string[];
	state: string;
	setState: (e: SelectChangeEvent) => void;
}
const BasicSelect = ({ label, items, state, setState }: BasicSelectProps) => {
	return (
		<Box marginTop={"1rem"}>
			<FormControl
				fullWidth
				sx={{ maxWidth: "15rem" }}
			>
				<InputLabel id={`${label}-label`}>{label}</InputLabel>
				<Select
					labelId={`${label}-label`}
					id={`${label}-select`}
					value={state}
					label={label}
					onChange={setState}
				>
					{items.map((item) => (
						<MenuItem
							key={item}
							value={item}
						>
							{item}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
};
export default BasicSelect;
