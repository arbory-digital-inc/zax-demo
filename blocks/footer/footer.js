import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
  
  // Add the app images container and move the app store images
  setTimeout(() => {
    const thirdColumn = block.querySelector('.columns > div > div:nth-child(3)');
    if (thirdColumn) {
      const textParagraph = thirdColumn.querySelector('p:nth-child(2)');
      if (textParagraph) {
        // Create container for app store images
        const appImagesContainer = document.createElement('div');
        appImagesContainer.className = 'app-images-container';
        
        // Get all pictures from the paragraph
        const pictures = textParagraph.querySelectorAll('picture');
        
        // Clone and move pictures to the new container
        pictures.forEach(picture => {
          appImagesContainer.appendChild(picture.cloneNode(true));
        });
        
        // Insert the container after the text paragraph
        textParagraph.after(appImagesContainer);
      }
    }
  }, 100);
}
