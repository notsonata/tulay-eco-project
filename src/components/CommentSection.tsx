
import { useState } from "react";
import { Comment, Barangay } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import UserInfoForm from "./UserInfoForm";

interface CommentSectionProps {
  comments: Comment[];
  reportId: string;
  onAddComment: (commentData: { 
    reportId: string; 
    commenterName: string; 
    commenterPhoneNumber: string; 
    commenterBarangay: Barangay; 
    commentText: string;
  }) => Promise<void>;
  showFullInfo?: boolean;
}

const CommentSection = ({ comments, reportId, onAddComment, showFullInfo = false }: CommentSectionProps) => {
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Function to censor last name (show only first name and first letter of last name)
  const censorName = (fullName: string) => {
    if (showFullInfo) return fullName;
    
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0];
    
    const firstName = nameParts[0];
    const lastNameInitial = nameParts[nameParts.length - 1][0];
    
    return `${firstName} ${lastNameInitial}.`;
  };
  
  const handleUserInfoSubmit = async (userInfo: {name: string; phoneNumber: string; barangay: Barangay}) => {
    if (!commentText.trim()) {
      alert("Please enter a comment");
      return;
    }
    
    try {
      setSubmitting(true);
      
      await onAddComment({
        reportId,
        commenterName: userInfo.name,
        commenterPhoneNumber: userInfo.phoneNumber,
        commenterBarangay: userInfo.barangay,
        commentText
      });
      
      // Reset form
      setCommentText("");
      setShowUserInfoForm(false);
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
      
      {/* Comment form */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Add a Comment</h4>
        <Textarea
          placeholder="Share your thoughts or additional information..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="mb-3 min-h-[100px]"
          disabled={showUserInfoForm || submitting}
        />
        
        {showUserInfoForm ? (
          <div className="mt-4 bg-card p-4 rounded-lg border animate-fade-in">
            <h4 className="text-sm font-semibold mb-3">Please provide your information to post this comment</h4>
            <UserInfoForm
              onSubmit={handleUserInfoSubmit}
              submitting={submitting}
              buttonText="Post Comment"
            />
            <Button
              variant="ghost"
              className="mt-2 w-full"
              onClick={() => setShowUserInfoForm(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => {
              if (!commentText.trim()) {
                alert("Please enter a comment");
                return;
              }
              setShowUserInfoForm(true);
            }}
            className="w-full sm:w-auto"
          >
            Submit Comment
          </Button>
        )}
      </div>
      
      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-card p-4 rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{censorName(comment.commenterName)}</p>
                  {showFullInfo ? (
                    <>
                      <p className="text-xs text-muted-foreground">
                        From {comment.commenterBarangay}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {comment.commenterPhoneNumber}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      From {comment.commenterBarangay}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.commentTimestamp), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm">{comment.commentText}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
