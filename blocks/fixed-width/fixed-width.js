/**
 * Initializes the fixed-width block.
 * @param {Element} block The fixed-width block element
 */
export default function decorate(block) {
  // Get the configuration row (first row)
  const configRow = block.children[0];
  
  if (configRow && configRow.children.length >= 2) {
    const keyCell = configRow.children[0];
    const valueCell = configRow.children[1];
    
    // Check if this is the max-width configuration
    if (keyCell.textContent.trim().toLowerCase() === 'max-width') {
      // Get the max-width value from the second cell
      const maxWidthValue = valueCell.textContent.trim();
      
      // Apply the max-width to the content container (second row)
      if (block.children[1]) {
        // Apply max-width to the content container
        block.children[1].style.maxWidth = maxWidthValue;
        
        // Also apply it to the block itself for centering
        block.style.maxWidth = maxWidthValue;
      }
    }
    
    // Hide the configuration row
    configRow.style.display = 'none';
  }
  
  // Center the block
  block.style.margin = '0 auto';
}