import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export function NewNoteCard({
	handleAddNote,
}: {
	handleAddNote: (content: string) => void;
}) {
	const [shouldShowOnboarding, setShouldShowOnboarding] =
		React.useState<boolean>(true);
	const [content, setContent] = React.useState<string>('');
	const [open, setOpen] = React.useState<boolean>(false);

	function resetNoteCreation() {
		setContent('');
		setShouldShowOnboarding(true);
		setOpen(false);
	}

	function handleStartEditor() {
		setShouldShowOnboarding(false);
	}

	function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
		setContent(event.target.value);

		if (event.target.value === '' && !shouldShowOnboarding) {
			setShouldShowOnboarding(true);
		}
	}

	function handleSaveNote(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (content === '') {
			toast.error('A nota não pode estar vazia');
			return;
		}

		handleAddNote(content);
		resetNoteCreation();

		toast.success('Nota criada com sucesso');
	}

	return (
		<Dialog.Root
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					resetNoteCreation();
				}
			}}>
			<Dialog.Trigger
				className='rounded-md text-left bg-slate-700 p-5 flex flex-col gap-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none'
				onClick={() => setOpen(true)}>
				<span className='text-sm font-medium text-slate-200'>
					Adicionar nota
				</span>
				<p className='text-sm leading-6 text-slate-400'>
					Grave uma nota em áudio que será convertida para texto
					automaticamente.
				</p>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 bg-black/60' />
				<Dialog.Content className='overflow-hidden fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none'>
					<Dialog.Close className='absolute top-0 right-0 bg-slate-800 text-slate-400 p-1.5 hover:text-slate-100'>
						<X className='size-5 ' />
					</Dialog.Close>

					<form onSubmit={handleSaveNote} className='flex-1 flex flex-col'>
						<div className='flex flex-1 flex-col gap-3 p-5'>
							<span className='text-sm font-medium text-slate-300'>
								Adicionar nota
							</span>

							{shouldShowOnboarding ? (
								<p className='text-sm leading-6 text-slate-400'>
									Comece{' '}
									<button className='font-medium text-lime-400 hover:underline'>
										gravando uma nota
									</button>{' '}
									em áudio ou, se preferir,{' '}
									<button
										className='font-medium text-lime-400 hover:underline'
										onClick={handleStartEditor}>
										utilize apenas texto
									</button>
									.
								</p>
							) : (
								<textarea
									autoFocus
									placeholder='Digite sua nota...'
									className='text-sm leading-6 text-slate-400 resize-none outline-none flex-1 bg-transparent'
									onChange={handleContentChange}
									value={content}
								/>
							)}
						</div>

						<button
							type='submit'
							className='text-sm w-full bg-lime-400 py-4 text-center text-lime-950 outline-none font-medium hover:bg-lime-500'>
							Salvar nota
						</button>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
