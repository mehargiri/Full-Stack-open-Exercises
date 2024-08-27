import { ChangeEvent, useState } from "react";

export const useField = <T extends string>(
	title: string,
	type: "text" | "date" | "radio",
	options?: T[] | Record<string, T>,
	defaultValue: T = "" as T
) => {
	const initialValue: T = defaultValue;
	const [value, setValue] = useState<T>(initialValue);

	const onChange = (e: ChangeEvent<HTMLInputElement>) =>
		setValue(e.target.value as T);

	const reset = () => setValue(initialValue);

	let normalizedOptions: T[] = [];

	if (type === "radio" && options) {
		if (options) {
			if (Array.isArray(options)) {
				normalizedOptions = options;
			} else {
				normalizedOptions = Object.values(options);
			}
		}

		const inputs = normalizedOptions.map((option) => ({
			id: `${title}-${option}`,
			name: title,
			type,
			value: option,
			checked: value === option,
			onChange,
		}));

		return { inputs, reset, selectedValue: value };
	}

	return {
		id: title,
		name: title,
		type,
		value,
		onChange,
		reset,
	};
};
