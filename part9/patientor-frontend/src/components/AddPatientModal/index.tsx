import {
	Alert,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
} from "@mui/material";

import AddPatientForm from "./AddPatientForm";

interface Props {
	modalOpen: boolean;
	onClose: () => void;
	error?: string;
	setError: React.Dispatch<React.SetStateAction<string | undefined>>;
	setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddPatientModal = ({
	modalOpen,
	onClose,
	error,
	setError,
	setModal,
}: Props) => (
	<Dialog
		fullWidth={true}
		open={modalOpen}
		onClose={() => {
			onClose();
		}}
	>
		<DialogTitle>Add a new patient</DialogTitle>
		<Divider />
		<DialogContent>
			{error && <Alert severity="error">{error}</Alert>}
			<AddPatientForm
				onCancel={onClose}
				setError={setError}
				setModal={setModal}
			/>
		</DialogContent>
	</Dialog>
);

export default AddPatientModal;
