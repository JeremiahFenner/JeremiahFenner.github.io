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
            content.style.display = "block";
        }
    }
    
    let allContentDivs = document.querySelectorAll('.content');
    for (let i = 0; i < allContentDivs.length; i++) {
        let contentDiv = allContentDivs[i];
        if (contentDiv) {
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
    
    for (let i = 0; i < collapsibleElements.length; i++) {
        if (collapsibleElements[i] && collapsibleElements[i].innerHTML.toLowerCase().includes(input)) {
            matchedElements.add(collapsibleElements[i]);
            if (!foundMatch) {
                firstMatch = collapsibleElements[i];
                foundMatch = true;
            }
        }
    }
    
    for (let element of matchedElements) {
        if (!element) continue;
        
        element.style.display = "block";
        element.classList.add("active");
        
        let content = element.nextElementSibling;
        if (content && content.classList && content.classList.contains('content')) {
            content.style.display = "block";
            
            let childCollapsibles = content.querySelectorAll('.collapsible');
            for (let child of childCollapsibles) {
                if (child) {
                    child.style.display = "block";
                }
            }
            
            let childContentDivs = content.querySelectorAll('.content');
            for (let childContent of childContentDivs) {
                if (childContent) {
                    childContent.style.display = "block";
                }
            }
        }
        
        let parent = element.parentElement;
        while (parent) {
            if (parent.classList && parent.classList.contains('content')) {
                parent.style.display = "block";
                
                let parentButton = parent.previousElementSibling;
                if (parentButton && parentButton.classList && parentButton.classList.contains('collapsible')) {
                    parentButton.style.display = "block";
                    parentButton.classList.add("active");
                }
            }
            parent = parent.parentElement;
        }
    }
    
    setTimeout(() => {
        for (let element of matchedElements) {
            if (!element) continue;
            let content = element.nextElementSibling;
            if (content && content.classList && content.classList.contains('content')) {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        }
        
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
    
    if (foundMatch && firstMatch) {
        setTimeout(() => {
            if (firstMatch) {
                firstMatch.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }, 200);
    } else if (input.length > 0) {
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
    // Check if the button's content div contains a link
    var content = button.nextElementSibling;
    
    // Look for a link within the content
    if (content && content.classList.contains('content')) {
        var link = content.querySelector('.info-btn');
        
        // If a link exists and this is a leaf node (no nested collapsibles), navigate to it
        if (link) {
            var hasNestedCollapsibles = content.querySelector('.collapsible');
            if (!hasNestedCollapsibles) {
                window.location.href = link.getAttribute('href');
                return;
            }
        }
    }
    
    // Otherwise, proceed with normal collapse/expand behavior
    var isCurrentlyExpanded = button.classList.contains("active") && 
                              content.style.maxHeight && 
                              content.style.maxHeight !== "0px";
    
    if (isCurrentlyExpanded) {
        button.classList.remove("active");
        content.style.maxHeight = "0px";
        
        setTimeout(() => {
            updateParentHeights(button);
        }, 50);
        
        setTimeout(() => {
            updateParentHeights(button);
        }, 450);
        
    } else {
        button.classList.add("active");
        
        const fullHeight = content.scrollHeight;
        content.style.maxHeight = fullHeight + "px";
        
        setTimeout(() => {
            updateParentHeights(button);
        }, 50);
        
        setTimeout(() => {
            updateParentHeights(button);
        }, 200);
        
        setTimeout(() => {
            updateParentHeights(button);
        }, 450);
    }
}

function updateParentHeights(element) {
    let currentElement = element;
    
    while (currentElement) {
        let parent = currentElement.parentElement;
        
        if (parent && parent.classList && parent.classList.contains('content')) {
            let parentButton = parent.previousElementSibling;
            if (parentButton && parentButton.classList.contains('active')) {
                const currentMaxHeight = parent.style.maxHeight;
                parent.style.maxHeight = 'none';
                const newHeight = parent.scrollHeight;
                
                if (Math.abs(parseInt(currentMaxHeight) - newHeight) > 5) {
                    parent.style.maxHeight = newHeight + "px";
                } else {
                    parent.style.maxHeight = currentMaxHeight;
                }
            }
            
            currentElement = parentButton;
        } else {
            break;
        }
    }
}


const myButtons = document.querySelectorAll('#socialBtn, #storeBtn');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScrollTop > lastScrollTop) {
    myButtons.forEach(button => {
      button.classList.add('opaque-button');
    });
  } else {
    myButtons.forEach(button => {
      button.classList.remove('opaque-button');
    });
  }

  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
});


const socialBtn = document.getElementById('socialBtn');
const socialButtons = document.getElementById('socialButtons');

socialBtn.addEventListener('click', () => {
    socialButtons.classList.toggle('show');
});