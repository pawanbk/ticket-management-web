import React, { useEffect, useState } from "react";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FileService from "../../api/FileService";
import TicketService from "../../api/TicketServices";
import Attachment from "./attachment";

const Upload = ({ ticket, attachments: initialAttachments = [] }) => {
  const [attachments, setAttachments] = useState(initialAttachments);
  const API_URL = `${process.env.REACT_APP_API_URL}/file/upload`;

  useEffect(() => {
    if (ticket) {
      fetchAttachments();
    }
  }, [ticket]);

  const fetchAttachments = async () => {
    try {
      const results = await TicketService.getAttachments(ticket);
      if (results?.attachments) {
        setAttachments(results.attachments);
      }
    } catch (error) {
      console.error("Failed to fetch attachments:", error);
    }
  };

  const downloadFile = async (id) => {
    try {
      if (id) await FileService.download(id);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const copyToClipBoard = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      alert("File ID copied to clipboard");
    });
  };

  const deleteFile = async (id) => {
    try {
      const results = await FileService.delete(id);
      if (results?.success) {
        await fetchAttachments();
      }
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  return (
    <div>
      <FilePond
        allowMultiple={true}
        maxFiles={3}
        server={{
          process: {
            method: "POST",
            url: API_URL,
            ondata: (formData) => {
              formData.append("ticketId", ticket);
              return formData;
            },
          },
        }}
        onprocessfile={(error) => {
          if (!error) {
            fetchAttachments();
          }
        }}
        instantUpload={true}
        name="file"
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
      <div className="mt-5">
        { attachments.length > 0 && 
          <Attachment attachments={attachments} downloadFile={downloadFile} copyToClipBoard={copyToClipBoard} deleteFile={deleteFile} />
        }
        </div>
    </div>
  );
};

export default Upload;
