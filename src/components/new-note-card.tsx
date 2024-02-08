import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const SpeechRecognitionAPI =
	window.SpeechRecognition || window.webkitSpeechRecognition;

const speechRecognition = new SpeechRecognitionAPI();

export function NewNoteCard({
	handleAddNote,
}: {
	handleAddNote: (content: string) => void;
}) {
	const [shouldShowOnboarding, setShouldShowOnboarding] =
		React.useState<boolean>(true);
	const [content, setContent] = React.useState<string>('');
	const [open, setOpen] = React.useState<boolean>(false);
	const [isRecording, setIsRecording] = React.useState<boolean>(false);

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

	function handleSaveNote(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();

		if (content === '') {
			toast.error('A nota não pode estar vazia');
			return;
		}

		handleAddNote(content);
		resetNoteCreation();

		toast.success('Nota criada com sucesso');
	}

	function handleStartRecording() {
		setIsRecording(true);

		const isSpeechRecognitionSupported =
			'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

		if (!isSpeechRecognitionSupported) {
			toast.error(
				'Seu navegador não suporta gravação de áudio. Você ainda pode utilizar o campo de texto para criar uma nota.',
			);
			return;
		}

		setIsRecording(true);
		setShouldShowOnboarding(false);

		speechRecognition.lang = 'pt-BR';
		speechRecognition.continuous = true;
		speechRecognition.maxAlternatives = 1;
		speechRecognition.interimResults = true;

		speechRecognition.onresult = (event) => {
			const transcript = Array.from(event.results).reduce(
				(text, result) => text.concat(result[0].transcript),
				'',
			);

			setContent(transcript);
		};

		speechRecognition.onerror = (event) => {
			console.error(event.error);
		};

		speechRecognition.start();
	}

	function handleStopRecording() {
		setIsRecording(false);

		if (speechRecognition !== null) {
			speechRecognition.stop();
		}
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
				<Dialog.Content className='overflow-hidden fixed inset-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
					<Dialog.Close className='absolute top-0 right-0 bg-slate-800 text-slate-400 p-1.5 hover:text-slate-100'>
						<X className='size-5 ' />
					</Dialog.Close>

					<form className='flex-1 flex flex-col'>
						<div className='flex flex-1 flex-col gap-3 p-5'>
							<span className='text-sm font-medium text-slate-300'>
								Adicionar nota
							</span>

							{shouldShowOnboarding ? (
								<p className='text-sm leading-6 text-slate-400'>
									Comece{' '}
									<button
										type='button'
										className='font-medium text-lime-400 hover:underline'
										onClick={handleStartRecording}>
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

						{isRecording ? (
							<button
								type='button'
								onClick={handleStopRecording}
								className='text-sm w-full bg-slate-900 py-4 justify-center flex gap-2 items-center text-center text-slate-300 outline-none font-medium hover:text-slate-100'>
								<div className='rounded-full bg-red-500 size-3 animate-pulse' />
								Em gravação... clique para interromper.
							</button>
						) : (
							<button
								type='button'
								onClick={handleSaveNote}
								className='text-sm w-full bg-lime-400 py-4 text-center text-lime-950 outline-none font-medium hover:bg-lime-500'>
								Salvar nota
							</button>
						)}
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
