"use client";

import React, { useEffect } from "react";

import EditorExtension from "./EditorExtension";

import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import CharacterCount from "@tiptap/extension-character-count";

function TextEditor({ fileId }) {
  const getNotes = useQuery(api.notes.fetchNotes, { fileId: fileId });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      Placeholder.configure({
        placeholder: "Write something …",
      }),
      CharacterCount,
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none h-screen p-5",
        // "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    editor?.commands?.setContent(getNotes);
    // console.log(getNotes);
  }, [getNotes]);

  return (
    <div>
      <EditorExtension editor={editor} />
      <div className="overflow-scroll h-[80vh]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default TextEditor;
