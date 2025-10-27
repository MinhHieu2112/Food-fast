import { useState } from "react";

export default function DeleteButton({label, onDelete}) {
    const [showConfirm, setShowConfirm] = useState(false);
        if (showConfirm) {
        return(
            <div className="fixed bg-black/80 inset-0 flex items-center h-full justify-center">
                <div className="bg-white p-4 rounded-lg">
                    <div>Are you sure you want to delete ?</div>
                        <div className="flex gap-2 mt-2">
                            <button type="button" 
                                    className="btn-register" 
                                    onClick={() => setShowConfirm(false)}>
                                Cancel
                            </button>
                            <button type="button" 
                                    className="primary btn-register" 
                                    onClick={onDelete}>Yes,&nbsp;delete!
                            </button>
                        </div>
                </div>
            </div>
        );
    }
    return (
        <button 
            onClick={() => setShowConfirm(true)} 
            type="button" 
            className="btn-register hover:bg-gray-200 bg-white">
            {label}
        </button>
    );
}
// export default function DeleteButton({ label, onDelete }) {
//   async function handleClick() {
//     const confirmed = window.confirm("Are you sure you want to delete this item?");
//     if (confirmed) {
//       await onDelete();
//     }
//   }

//   return (
//     <button
//       onClick={handleClick}
//       type="button"
//       className="btn-register hover:bg-gray-200 bg-white"
//     >
//       {label || "Delete"}
//     </button>
//   );
// }
