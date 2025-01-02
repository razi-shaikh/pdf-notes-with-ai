import React from "react";
import {
  Baseline,
  Bold,
  ChevronDown,
  Code,
  File,
  FileText,
  Globe,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  LetterText,
  Sparkles,
  Underline,
} from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { chatSession } from "@/configs/geminiAiModel";

import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";

function EditorExtension({ editor }) {
  const { fileId } = useParams();
  const saveNotes = useMutation(api.notes.addNotes);
  const { user } = useUser();
  const allText = editor?.getHTML();

  const searchAiPdf = useAction(api.myActions.search);

  // from pdf
  const handelAiPdf = async () => {
    toast("Getting answer from PDF.");
    const selectedText = editor?.state.doc.textBetween(
      editor?.state.selection.from,
      editor?.state.selection.to
    );
    // console.log("selectedText", selectedText);

    const result = await searchAiPdf({ query: selectedText, fileId });
    // console.log("unformatted answer", result);
    const formattedResult = JSON.parse(result);
    // console.log("formatted answer", formattedResult);

    let answernContext = "";
    formattedResult &&
      formattedResult.map((item) => {
        answernContext += item.pageContent;
      });

    // const prompt = `Answer the following question based on the context. If you don't know the answer, say "I don't know or pdf does not cantain answer".Note: "Please give appropriate answer in html format".\n\nQuestion: ${selectedText}\n\nContext: ${selectedText}\n\nAnswer: `;
    const prompt = `
You are an AI assistant. Answer the following question based solely on the given context. 
If the context does not contain the answer, respond with "I don't know or the PDF does not contain the answer." 
"Please give appropriate answer in html format Note: 'Only body'"
Question: ${selectedText}
Context: ${answernContext}
Answer:
`;

    const answer = await chatSession.sendMessage(prompt);
    // console.log(answer.response.text());

    const finalAnswer = answer.response
      .text()
      .replace("```html", "")
      .replace("```", "");

    const allText = editor?.getHTML();
    editor?.commands.setContent(
      `${allText}<p><Strong>Answer</Strong></p>\n${finalAnswer}`
    );
  };

  // from internet
  const handelAiInternet = async () => {
    toast("Getting answer from Internet.");
    const selectedText = editor?.state.doc.textBetween(
      editor?.state.selection.from,
      editor?.state.selection.to
    );

    const result = await searchAiPdf({ query: selectedText, fileId });
    // console.log("unformatted answer", result);
    const formattedResult = JSON.parse(result);
    // console.log("formatted answer", formattedResult);

    let answernContext = "";
    formattedResult &&
      formattedResult.map((item) => {
        answernContext += item.pageContent;
      });

    // const prompt = `Answer the following question. It doen't mater that context does not have answer use internet to search. you can use context to search also. Note: "Please give appropriate answer in html format".\n\nQuestion: ${selectedText}\n\nContext: ${answernContext}\n\nAnswer: `;
    const prompt = `
    You are an AI assistant tasked with creating clear and accurate notes. Use the provided context, if available, to improve the quality of your answer. Incorporate external knowledge seamlessly to ensure accuracy and completeness without explicitly referring to the context or external sources.
    
    "Please give appropriate answer in html format Note: 'Only body'"
    Question: ${selectedText}
    Context: ${answernContext}
    Answer:
    `;

    const answer = await chatSession.sendMessage(prompt);
    // console.log(answer.response.text());

    const finalAnswer = answer.response
      .text()
      .replace("```html", "")
      .replace("```", "");

    const allText = editor?.getHTML();
    editor?.commands.setContent(
      `${allText}<p><Strong>Answer</Strong></p>\n${finalAnswer}`
    );
    // editor?.commands.insertContent(answer);
  };

  // AI Formatter
  const handelAiFormater = async () => {
    toast("Formating the notes.");
    try {
      // Retrieve the selected text from the editor
      const selectedText = editor?.state.doc.textBetween(
        editor?.state.selection.from,
        editor?.state.selection.to
      );

      // Fallback if no text is selected
      if (!selectedText) {
        // console.error("No text selected for formatting.");
        return;
      }

      // console.log("Selected Text:", selectedText);

      const allText = editor?.getHTML();
      // console.log(allText);

      // Define the prompt for the AI
      const prompt = `
      You are an AI assistant. Format the given html into a clean, structured HTML format for better readability.
      try to remove extra spaces and new lines.
      "Please give appropriate answer in html format Note: 'Only body'"
      html: ${allText}
      Output:
    `;

      // Send the prompt to the AI session
      const answer = await chatSession.sendMessage(prompt);
      // console.log(answer.response.text());
      const finalAnswer = answer.response
        .text()
        .replace("```html", "")
        .replace("```", "");

      editor?.commands.insertContent(finalAnswer);
    } catch (error) {
      // console.error("Error formatting text:", error);
    }
  };

  // saving notes
  const handelSaveNotes = async () => {
    try {
      await saveNotes({
        fileId,
        content: allText,
        createdBy: user?.fullName,
      });
      toast("Saving the notes");
    } catch (error) {
      toast("Unable to save the notes");
      // console.log(error);
    }
  };

  // Functions for PDF
  const downloadAsPdf = (content) => {
    const pdf = new jsPDF();
    pdf.html(content, {
      callback: (doc) => {
        doc.save("notes.pdf");
      },
    });
  };

  // Functions for Word download
  const downloadAsWord = (content) => {
    const doc = new Document({
      sections: [
        {
          children: [new Paragraph(content)],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "note.docx");
    });
  };

  return (
    <div className="m-4">
      <div className="control-group">
        <div className="button-group flex gap-2">
          {/* Toggle bold */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={
              editor?.isActive("bold")
                ? "text-blue-500 bg-gray-200 rounded-full p-2"
                : "p-2"
            }
          >
            <Bold />
          </button>
          {/* Toggle italic */}
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor?.isActive("italic")
                ? "text-blue-500 bg-gray-200 rounded-full p-2"
                : " p-2"
            }
          >
            <Italic />
          </button>
          {/* code */}
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={
              editor?.isActive("code")
                ? "text-blue-500 bg-gray-200 rounded-full p-2"
                : " p-2"
            }
          >
            <Code />
          </button>
          {/* underline */}
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={
              editor?.isActive("underline")
                ? "text-blue-500 bg-gray-200 rounded-full p-2"
                : " p-2"
            }
          >
            <Underline />
          </button>
          {/* strike */}
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor?.isActive("strike") ? "is-active" : ""}
          >
            <Baseline />
          </button>
          {/* headings */}
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor?.isActive("heading", { level: 1 })
                ? "text-blue-500 bg-gray-200 rounded-full p-2"
                : " p-2"
            }
          >
            <Heading1 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor?.isActive("heading", { level: 2 })
                ? "text-blue-500 bg-gray-200 rounded-full p-2"
                : " p-2"
            }
          >
            <Heading2 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor?.isActive("heading", { level: 3 })
                ? "text-blue-500 bg-gray-200 rounded-full p-2"
                : " p-2"
            }
          >
            <Heading3 />
          </button>
          {/* Toggle Ai pdf */}
          <button
            onClick={handelAiPdf}
            className={"text-blue-500 bg-gray-200 rounded-full p-2"}
          >
            <Sparkles />
          </button>
          {/* Toggle Ai internet */}
          <button
            onClick={handelAiInternet}
            className={"text-blue-500 bg-gray-200 rounded-full p-2"}
          >
            <Globe />
          </button>
          {/* Toggle ai formater */}
          <button
            onClick={handelAiFormater}
            className={"text-blue-500 bg-gray-200 rounded-full p-2"}
          >
            <LetterText />
          </button>
          {/* save button */}
          <Button className="rounded-full">
            <div onClick={handelSaveNotes}> Save</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <ChevronDown />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Download</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      const content = editor?.getHTML(); // HTML content for PDF
                      downloadAsPdf(content);
                    }}
                  >
                    PDF
                    <DropdownMenuShortcut>
                      <File />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const content = editor?.getText(); // Plain text for Word
                      downloadAsWord(content);
                    }}
                  >
                    Word
                    <DropdownMenuShortcut>
                      <FileText />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </Button>
          {/* end save button */}

          {/* characters and words */}
          <div className="text-sm">
            {editor?.storage?.characterCount?.characters()} characters
            <br />
            {editor?.storage?.characterCount?.words()} words
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorExtension;
