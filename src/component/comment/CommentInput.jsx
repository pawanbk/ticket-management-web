import './CommentInput.css'
import TextareaAutosize from 'react-textarea-autosize';

const CommentInput = (props) => {
    return (
        <div className="comment-input">
            <TextareaAutosize
                className="w-100 p-2 border rounded mt-1"
                as="textarea"
                placeholder="write a comment here..."
                name="commentInput"
                value={props.commentInput}
                onChange={props.change}
                onKeyUp={(e) => e.key === 'Enter' && props.addComment()}
                disabled={!props.isEmailVerified}
            />
            <div className="float-right  my-1">
                {props.cancelBtn &&
                    <button className="btn btn-sm btn-secondary " onClick={props.hideCommentInput}>Cancel</button>}

                {/* <button className="btn btn-sm btn-primary mx-1" onClick={props.addComment}>Comment</button> */}
            </div>


        </div>
    )
}

export default CommentInput