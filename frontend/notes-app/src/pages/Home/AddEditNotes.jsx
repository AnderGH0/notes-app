import { useState } from 'react';
import TagInput from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({noteData, type, onClose, getAllNotes, showToastMessage}) => {

    const [title, setTitle] = useState(noteData?.title || '');
    const [content, setContent] = useState(noteData?.content || '');
    const [tags, setTags] = useState(noteData?.tags || []);

    const [error, setError] = useState(null);

    //Add note
    const addNewNote = async () => {
       try {
        const response = await axiosInstance.post("/add-note", {
            title, 
            content,
            tags
        });
        if(response.data && response.data.note){
            showToastMessage("Note added successfully", "edit");
            getAllNotes();
            onClose();
        }
       } catch (error){
        console.log(error);
       }
    }

    //Edit note
    const editNote = async () => {
        const noteId = noteData._id;
        try {
            const response = await axiosInstance.put("/edit-note/" + noteId, {
                title, 
                content,
                tags
            });
            if(response.data && response.data.note){
                showToastMessage("Note updated successfully", "edit");
                getAllNotes();
                onClose();
            }
           } catch (error){
            console.log(error);
           }
    }

    const handleAddNote = () => {
        if(title.trim() === '' || content.trim() === '') {
            setError('Title and Content are required');
            return;
        }
        setError(null);

        if(type === "edit"){
            editNote();
        } else {
            addNewNote();
        }
    }

  return (
    <div className='relative'>
        <button className='w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 absolute right-3 top-3 hover:bg-slate-600 hover:text-slate-200 cursor-pointer'>
            <MdClose onClick={onClose} className='text-xl text-slate-400 '/>
        </button>

        <div className='flex flex-col gap-2'>
            <label htmlFor="title" className='input-label'>Title</label>
            <input 
                id="title"
                type="text" 
                className='text-2xl text-slate-950 outline-none'
                placeholder='Note Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
        </div>

        <div className='flex flex-col gap-2 mt-4'>
            <label htmlFor="content" className='input-label'>CONTENT</label>
            <textarea 
                name="content" 
                id="content" 
                type="text"
                className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                placeholder="Write something..."
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>

        <div className='mt-3'>
            <label htmlFor="tags" className='input-label'>TAGS</label>
            <TagInput tags={tags} setTags={setTags}/>
        </div>

        {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

        <button className='btn-primary font-medium mt-5 p3' onClick = {handleAddNote}>{type === "edit"? "UPDATE" : "ADD"}</button>

    </div>
  )
}

export default AddEditNotes