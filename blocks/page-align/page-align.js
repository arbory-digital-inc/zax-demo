/**
 * Initializes the page-align block.
 * @param {Element} block The page-align block element
 */
export default function decorate(block) {
  // Get the variant class if present (center or right)
  const variant = block.classList.length > 1 ? block.classList[1] : 'left';
  
  // Apply the variant class to ensure proper styling
  if (variant !== 'left') {
    block.classList.add(variant);
  }
  
  // Make sure the block takes full width of its container
  block.style.width = '100%';
  
  // Apply text alignment to all content within the block
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'page-align-content';
  
  // Move all children into the content wrapper
  while (block.firstChild) {
    contentWrapper.appendChild(block.firstChild);
  }
  
  // Add the content wrapper back to the block
  block.appendChild(contentWrapper);
}