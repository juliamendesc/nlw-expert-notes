import React from 'react';
import logo from './assets/logo-nlw-expert.svg';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';

interface Note {
	id: string;
	date: Date;
	content: string;
}

export function App() {
	const [search, setSearch] = React.useState<string>('');
	const [notes, setNotes] = React.useState<Note[]>(() => {
		const notesOnStorage = localStorage.getItem('notes');

		if (notesOnStorage) {
			return JSON.parse(notesOnStorage);
		} else {
			return [];
		}
	});

	function saveNotesToLocalStorage(notes: Note[]) {
		localStorage.setItem('notes', JSON.stringify(notes));
	}

	function handleAddNote(content: string) {
		const newNote: Note = {
			id: crypto.randomUUID(),
			date: new Date(),
			content,
		};

		setNotes([newNote, ...notes]);
		saveNotesToLocalStorage([newNote, ...notes]);
	}

	function handleSearchNotes(event: React.ChangeEvent<HTMLInputElement>) {
		event.preventDefault();

		setSearch(event.target.value);
	}

	const filteredNotes =
		search !== ''
			? notes.filter((note) =>
					note.content.toLocaleLowerCase().includes(search),
			  )
			: notes;

	return (
		<div className='mx-auto max-w-6xl my-12 space-y-6'>
			<img src={logo} alt='NLW Expert' />

			<form className='w-full'>
				<input
					type='text'
					placeholder='Busque em suas notas...'
					className='w-full bg-transparent text-2xl font-semibold tracking-tight placeholder:text-slate-500 outline-none'
					onChange={handleSearchNotes}
				/>
			</form>

			<div className='h-px bg-slate-600' />

			<div className='grid grid-cols-3 auto-rows-[250px] gap-6'>
				<NewNoteCard handleAddNote={handleAddNote} />

				{filteredNotes.map((note: Note) => (
					<NoteCard key={note.id} note={note} />
				))}
			</div>
		</div>
	);
}
