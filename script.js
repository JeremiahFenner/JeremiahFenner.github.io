















function execute_search() {
    let input = document.getElementById('searchbar').value;
    input = input.toLowerCase();
    let collapsibleElements = document.getElementsByClassName('collapsible');
    
    // Reset all elements to default state
    for (let i = 0; i < collapsibleElements.length; i++) {
        collapsibleElements[i].style.display = "none";
        collapsibleElements[i].classList.remove("active");
        let content = collapsibleElements[i].nextElementSibling;
        if (content && content.classList.contains('content')) {
            content.style.maxHeight = "0px";
            content.style.display = "block"; // Keep content divs visible for structure
        }
    }
    
    // Also hide all non-collapsible content divs
    let allContentDivs = document.querySelectorAll('.content');
    for (let i = 0; i < allContentDivs.length; i++) {
        let contentDiv = allContentDivs[i];
        if (contentDiv) {
            // Check if this content div contains only text (leaf nodes)
            let hasOnlyText = true;
            for (let child of contentDiv.children) {
                if (child && child.classList && child.classList.contains('collapsible')) {
                    hasOnlyText = false;
                    break;
                }
            }
            if (hasOnlyText) {
                contentDiv.style.display = "none";
            }
        }
    }
    
    if (input === "") {
        // If search is empty, show all elements in default state
        for (let i = 0; i < collapsibleElements.length; i++) {
            if (collapsibleElements[i]) {
                collapsibleElements[i].style.display = "block";
            }
        }
        for (let contentDiv of allContentDivs) {
            if (contentDiv) {
                contentDiv.style.display = "block";
            }
        }
        return;
    }
    
    let foundMatch = false;
    let firstMatch = null;
    let matchedElements = new Set();
    
    // Find all matching elements first
    for (let i = 0; i < collapsibleElements.length; i++) {
        if (collapsibleElements[i] && collapsibleElements[i].innerHTML.toLowerCase().includes(input)) {
            matchedElements.add(collapsibleElements[i]);
            if (!foundMatch) {
                firstMatch = collapsibleElements[i];
                foundMatch = true;
            }
        }
    }
    
    // Show and expand matched elements and their hierarchies
    for (let element of matchedElements) {
        if (!element) continue;
        
        // Show the matching element
        element.style.display = "block";
        element.classList.add("active");
        
        // Expand its content if it has any
        let content = element.nextElementSibling;
        if (content && content.classList && content.classList.contains('content')) {
            content.style.display = "block";
            
            // Show all child collapsible elements within this content
            let childCollapsibles = content.querySelectorAll('.collapsible');
            for (let child of childCollapsibles) {
                if (child) {
                    child.style.display = "block";
                }
            }
            
            // Show all text content divs within this content
            let childContentDivs = content.querySelectorAll('.content');
            for (let childContent of childContentDivs) {
                if (childContent) {
                    childContent.style.display = "block";
                }
            }
        }
        
        // Show and expand all parent containers
        let parent = element.parentElement;
        while (parent) {
            if (parent.classList && parent.classList.contains('content')) {
                parent.style.display = "block";
                
                // Find and activate the parent button
                let parentButton = parent.previousElementSibling;
                if (parentButton && parentButton.classList && parentButton.classList.contains('collapsible')) {
                    parentButton.style.display = "block";
                    parentButton.classList.add("active");
                }
            }
            parent = parent.parentElement;
        }
    }
    
    // Set all heights after all elements are visible and structured - do this in reverse order (deepest first)
    setTimeout(() => {
        // First expand the matched elements' own content
        for (let element of matchedElements) {
            if (!element) continue;
            let content = element.nextElementSibling;
            if (content && content.classList && content.classList.contains('content')) {
                // Always expand the matched element's direct content first
                content.style.maxHeight = content.scrollHeight + "px";
            }
        }
        
        // Then expand parent containers from bottom up
        setTimeout(() => {
            for (let element of matchedElements) {
                if (!element) continue;
                
                // Update all parent containers
                let parent = element.parentElement;
                while (parent) {
                    if (parent.classList && parent.classList.contains('content')) {
                        // Recalculate parent height to include the expanded child
                        parent.style.maxHeight = parent.scrollHeight + "px";
                    }
                    parent = parent.parentElement;
                }
            }
            
            // Final pass to ensure all heights are correct
            setTimeout(() => {
                for (let element of matchedElements) {
                    if (!element) continue;
                    let parent = element.parentElement;
                    while (parent) {
                        if (parent.classList && parent.classList.contains('content')) {
                            parent.style.maxHeight = parent.scrollHeight + "px";
                        }
                        parent = parent.parentElement;
                    }
                }
            }, 10);
        }, 10);
    }, 20);
    
    // Scroll to the first match or to the collapsible list container
    if (foundMatch && firstMatch) {
        setTimeout(() => {
            if (firstMatch) {
                firstMatch.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }, 200); // Increased delay to ensure all expansions complete
    } else if (input.length > 0) {
        // If no matches but user is typing, scroll to the list container
        let listContainer = document.querySelector('.stack2');
        if (listContainer) {
            setTimeout(() => {
                listContainer.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 200);
        }
    }
}


function execute_collapse(button) {
    var content = button.nextElementSibling;
    
    var isCurrentlyExpanded = button.classList.contains("active") && 
                              content.style.maxHeight && 
                              content.style.maxHeight !== "0px";
    
    if (isCurrentlyExpanded) {
        button.classList.remove("active");
        content.style.maxHeight = "0px";
        
        // For collapsing, update parents immediately and after transition
        setTimeout(() => {
            updateParentHeights(button);
        }, 50);
        
        setTimeout(() => {
            updateParentHeights(button);
        }, 450); // After the 0.4s transition completes
        
    } else {
        button.classList.add("active");
        
        // Calculate and set the height smoothly
        const fullHeight = content.scrollHeight;
        content.style.maxHeight = fullHeight + "px";
        
        // Update parent heights progressively during expansion
        setTimeout(() => {
            updateParentHeights(button);
        }, 50);
        
        setTimeout(() => {
            updateParentHeights(button);
        }, 200);
        
        setTimeout(() => {
            updateParentHeights(button);
        }, 450); // Final update after transition completes
    }
}

// Helper function to update all parent container heights
function updateParentHeights(element) {
    let currentElement = element;
    
    while (currentElement) {
        let parent = currentElement.parentElement;
        
        if (parent && parent.classList && parent.classList.contains('content')) {
            // Check if parent button is active (expanded)
            let parentButton = parent.previousElementSibling;
            if (parentButton && parentButton.classList.contains('active')) {
                // Temporarily set to auto to get true height
                const currentMaxHeight = parent.style.maxHeight;
                parent.style.maxHeight = 'none';
                const newHeight = parent.scrollHeight;
                
                // Only update if height changed significantly (avoid micro-adjustments)
                if (Math.abs(parseInt(currentMaxHeight) - newHeight) > 5) {
                    parent.style.maxHeight = newHeight + "px";
                } else {
                    parent.style.maxHeight = currentMaxHeight;
                }
            }
            
            // Move to the parent button
            currentElement = parentButton;
        } else {
            break;
        }
    }
}





//////////////////////// Fade header elements when scrolling down

const myButtons = document.querySelectorAll('#socialBtn');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScrollTop > lastScrollTop) {
    // Scrolling down - apply to all buttons
    myButtons.forEach(button => {
      button.classList.add('opaque-button');
    });
  } else {
    // Scrolling up - remove from all buttons
    myButtons.forEach(button => {
      button.classList.remove('opaque-button');
    });
  }

  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
});










//////////////////////// Expand social media buttons
const socialBtn = document.getElementById('socialBtn');
const socialButtons = document.getElementById('socialButtons');

socialBtn.addEventListener('click', () => {
    socialButtons.classList.toggle('show');
});