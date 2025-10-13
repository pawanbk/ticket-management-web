import { Copy, Download, Trash } from "react-bootstrap-icons";
import "./attachment.css";

const Attachment = ({attachments, downloadFile, copyToClipBoard, deleteFile, isEmailVerified}) => {
    return (
        <div className="attachment-list">
            <ul>
                {attachments.map((attachment, index) => (
                    <li
                        key={attachment?._id || attachment?.name}
                        className={`p-4 flex justify-between items-center ${
                        index < attachments.length - 1 ? "border-b" : ""
                        }`}
                    >
                        <span className="font-medium">{attachment?.name}</span>
                        { isEmailVerified && 
                            <div className="flex gap-3 text-blue-500">
                                <span
                                    onClick={() => downloadFile(attachment?._id)}
                                    aria-label="Download file"
                                    className="cursor-pointer"
                                >
                                    <Download />
                                </span>
                                <span
                                    onClick={() => copyToClipBoard(attachment?._id)}
                                    aria-label="Copy file ID"
                                    className="cursor-pointer"
                                >
                                    <Copy />
                                </span>
                                <span
                                    onClick={() => deleteFile(attachment?._id)}
                                    aria-label="Delete file"
                                    className="cursor-pointer text-red-500"
                                >
                                    <Trash />
                                </span>
                            </div>
                }
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Attachment