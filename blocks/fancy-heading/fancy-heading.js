export default function decorate(block) {
  // Get the columns
  const columns = block.children[0];
  if (columns) {
    // First column - "Start Your"
    const firstColumn = columns.children[0];
    if (firstColumn) {
      firstColumn.classList.add('fancy-heading-first');
      
      // Find the heading
      const heading = firstColumn.querySelector('h2');
      if (heading) {
        heading.classList.add('fancy-heading-regular');
      }
    }
    
    // Second column - "Order"
    const secondColumn = columns.children[1];
    if (secondColumn) {
      secondColumn.classList.add('fancy-heading-second');
      
      // Find the heading
      const heading = secondColumn.querySelector('h2');
      if (heading) {
        heading.classList.add('fancy-heading-accent');
      }
    }
    
    // Add a horizontal line after the heading
    const hr = document.createElement('hr');
    hr.classList.add('fancy-heading-line');
    block.appendChild(hr);
  }
}