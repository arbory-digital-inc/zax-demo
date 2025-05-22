export default function decorate(block) {
  // Get the columns
  const columns = block.children[0];
  if (columns) {
    // Left column - main promo content
    const leftColumn = columns.children[0];
    if (leftColumn) {
      leftColumn.classList.add('rewards-main');
      
      // Find and style the logo, text, and image
      const paragraphs = leftColumn.querySelectorAll('p');
      if (paragraphs.length >= 3) {
        // First paragraph contains the logo
        paragraphs[0].classList.add('rewards-logo');
        
        // Second paragraph contains the text
        paragraphs[1].classList.add('rewards-text');
        
        // Third paragraph contains the main image
        paragraphs[2].classList.add('rewards-image');
      }
    }
    
    // Right column - deals & rewards
    const rightColumn = columns.children[1];
    if (rightColumn) {
      rightColumn.classList.add('rewards-sidebar');
      
      // Style the icon, text, heading, and button
      const paragraphs = rightColumn.querySelectorAll('p');
      if (paragraphs.length >= 3) {
        // First paragraph contains the icon
        paragraphs[0].classList.add('rewards-icon');
        
        // Second paragraph contains the text
        paragraphs[1].classList.add('sidebar-text');
        
        // Last paragraph contains the button
        paragraphs[paragraphs.length - 1].classList.add('button-container');
        
        // Style the button
        const button = paragraphs[paragraphs.length - 1].querySelector('a');
        if (button) {
          button.classList.add('rewards-button');
        }
      }
    }
  }
}