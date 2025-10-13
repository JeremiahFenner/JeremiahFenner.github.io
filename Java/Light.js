











const oval = document.getElementById('oval');
        let isActive = false;

        oval.addEventListener('click', function() {
            isActive = !isActive;
            
            if (isActive) {
                oval.classList.add('active');
            } else {
                oval.classList.remove('active');
            }
        });

        // Remove pulsing animation - keep light completely still