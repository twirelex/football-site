// window.addEventListener('DOMContentLoaded', () => {
//     fetchArticles(1);
// });

// function fetchArticles(page) {
//     fetch(`/?page=${page}`)
//         .then(response => response.text())
//         .then(html => {
//             const parser = new DOMParser();
//             const doc = parser.parseFromString(html, 'text/html');

//             const articlePreviewsContainer = document.getElementById('article-previews');
//             const paginationContainer = document.querySelector('.pagination');

//             articlePreviewsContainer.innerHTML = '';
//             paginationContainer.innerHTML = '';

//             const articlePreviews = doc.querySelectorAll('.article-preview');
//             const paginationLinks = doc.querySelectorAll('.pagination a');

//             articlePreviews.forEach((preview) => {
//                 articlePreviewsContainer.appendChild(preview);
//             });

//             paginationLinks.forEach((link) => {
//                 paginationContainer.appendChild(link);
//             });
//         })
//         .catch(error => console.error(error));
// }
