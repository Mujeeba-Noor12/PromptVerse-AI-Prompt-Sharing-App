
// // import React, { useEffect, useState } from 'react';
// // import { fetchBookmarkedPrompts } from '../api/prompts';
// // import PromptCard from '../components/prompts/PromptCard';

// // const BookMarked = () => {
// //   const [bookmarkedPrompts, setBookmarkedPrompts] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const loadBookmarks = async () => {
// //       try {
// //         const data = await fetchBookmarkedPrompts();
// //         setBookmarkedPrompts(data);
// //       } catch (error) {
// //         console.error('Failed to fetch bookmarks:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     loadBookmarks();
// //   }, []);
// //   const loadBookmarks = async () => {
// //   try {
// //     const data = await fetchBookmarkedPrompts();
// //     setBookmarkedPrompts(data);
// //   } catch (error) {
// //     console.error('Failed to fetch bookmarks:', error);
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// // useEffect(() => {
// //   loadBookmarks();
// // }, []);


// //   const handleRemovePrompt = (promptId) => {
// //     setBookmarkedPrompts((prev) =>
// //       prev.filter((prompt) => prompt._id !== promptId)
// //     );
// //   };

// //   return (
// //     <div className="container mx-auto px-4 py-6">
// //       <h2 className="text-2xl font-bold mb-4">Bookmarked Prompts</h2>
// //       : error ? (
// //         <div className="text-center py-12">
// //           <div className="text-red-600 text-lg mb-4">Error loading bookmarked prompts</div>
// //           <button 
// //             onClick={() => window.location.reload()}
// //             className="btn-primary"
// //           >
// //             Try Again
// //           </button>
// //         </div>
// //       ) : (
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           {bookmarkedPrompts.map((prompt) => (
// //             <PromptCard
// //               key={prompt._id}
// //               prompt={prompt}
// //               onBookmarkToggle={handleRemovePrompt}
// //               onRefresh={loadBookmarks} // ✅ pass refresh function

// //             />
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default BookMarked;
// import React, { useEffect, useState } from 'react';
// import { fetchBookmarkedPrompts } from '../api/prompts';
// import PromptCard from '../components/prompts/PromptCard';

// const BookMarked = () => {
//   const [bookmarkedPrompts, setBookmarkedPrompts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); // ✅ added error state

//   const loadBookmarks = async () => {
//     try {
//       setError(null); // reset error before retry
//       const data = await fetchBookmarkedPrompts();
//       setBookmarkedPrompts(data);
//     } catch (err) {
//       setError(err);
//       console.error('Failed to fetch bookmarks:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadBookmarks();
//   }, []);

//   // When user removes bookmark
//   const handleRemovePrompt = (promptId) => {
//     setBookmarkedPrompts((prev) =>
//       prev.filter((prompt) => prompt._id !== promptId)
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h2 className="text-2xl font-bold mb-4">Bookmarked Prompts</h2>

//       {loading ? (
//         <div className="text-center py-12">Loading...</div>
//       ) : error ? (
//         <div className="text-center py-12">
//           <div className="text-red-600 text-lg mb-4">
//             Error loading bookmarked prompts
//           </div>
//           <button onClick={loadBookmarks} className="btn-primary">
//             Try Again
//           </button>
//         </div>
//       ) : bookmarkedPrompts.length === 0 ? (
//         <div className="text-center py-12 text-gray-500">
//           No bookmarked prompts found.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {bookmarkedPrompts.map((prompt) => (
//             <PromptCard
//               key={prompt._id}
//               prompt={prompt}
//               onBookmarkToggle={() => {
//                 handleRemovePrompt(prompt._id); // 🧹 remove instantly from list
//                 loadBookmarks(); // 🔁 reload to reflect correct state from DB
//               }}
//               onRefresh={loadBookmarks}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookMarked;

import React, { useEffect, useState } from 'react';
import { fetchBookmarkedPrompts } from '../api/prompts';
import PromptCard from '../components/prompts/PromptCard';

const BookMarked = () => {
  const [bookmarkedPrompts, setBookmarkedPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadBookmarks = async () => {
    try {
      setError(false);
      setLoading(true);
      const data = await fetchBookmarkedPrompts();
      setBookmarkedPrompts(data);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleRemovePrompt = (promptId) => {
    setBookmarkedPrompts((prev) =>
      prev.filter((prompt) => prompt._id !== promptId)
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Bookmarked Prompts</h2>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-600 text-lg mb-4">
            Error loading bookmarked prompts
          </div>
          <button onClick={loadBookmarks} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : bookmarkedPrompts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No Bookmarked prompts yet</div>
          <p className="text-gray-600 mb-6">
            Start exploring and bookmarking prompts to see them here!
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary"
          >
            Explore Prompts
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarkedPrompts.map((prompt) => (
            <PromptCard
              key={prompt._id}
              prompt={prompt}
              onBookmarkToggle={() => {
                handleRemovePrompt(prompt._id);
                loadBookmarks(); // optional: keep in sync with backend
              }}
              onRefresh={loadBookmarks}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookMarked;
