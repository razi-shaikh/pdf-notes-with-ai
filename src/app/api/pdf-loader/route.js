// import { NextResponse } from "next/server";
// import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// export async function GET(req) {
//   const reqUrl = req.url;
//   const { searchParams } = new URL(reqUrl);
//   const pdfUrl = searchParams.get("pdf-url");
//   const fileName = searchParams.get("fileName");
//   const fileId = searchParams.get("fileId");
//   console.log(pdfUrl);

//   // step1: Load the pdf
//   const response = await fetch(pdfUrl);
//   const data = await response.blob();
//   const loader = new WebPDFLoader(data);
//   const docs = await loader.load();

//   let pdfTextContent = "";
//   docs.forEach((doc) => {
//     pdfTextContent += doc.pageContent;
//   });

//   // step2: split the text into smaller chunks
//   const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 2000,
//     chunkOverlap: 20,
//   });

//   const output = await splitter.createDocuments([pdfTextContent]);

//   let splitterList = [];
//   output.forEach((doc) => {
//     splitterList.push(doc.pageContent);
//   });

//   // Step 4: Transform metadata into the desired format
//   const metadata = output.map((doc) => {
//     return { fileName, fileId, loc: doc.metadata.loc };
//   });

//   return NextResponse.json({ result: splitterList, fileId });
// }

import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function GET(req) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const pdfUrl = searchParams.get("pdf-url");
  const fileName = searchParams.get("fileName");
  const fileId = searchParams.get("fileId");
  // console.log(pdfUrl);

  // Step 1: Load the PDF
  const response = await fetch(pdfUrl);
  const data = await response.blob();
  const loader = new WebPDFLoader(data);
  const docs = await loader.load();

  let pdfTextContent = "";
  docs.forEach((doc) => {
    pdfTextContent += doc.pageContent;
  });

  // Step 2: Split the text into smaller chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 20,
  });

  const output = await splitter.createDocuments([pdfTextContent]);

  let splitterList = [];
  output.forEach((doc) => {
    splitterList.push(doc.pageContent);
  });

  // Step 3: Transform metadata into the desired format (if needed)
  const metadata = output.map((doc) => {
    return { fileName, fileId, loc: doc.metadata.loc };
  });

  // Step 4: Send the response with fileId as plain text
  return NextResponse.json({ result: splitterList, fileId });
}
