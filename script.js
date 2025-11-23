        // Initialize a poll variable to a new Map object
        const poll = new Map();

        // Function to add an option to the poll
        function addOption(option) {
            if (!option) {
                return "Option cannot be empty.";
            }
            if (poll.has(option)) {
                return `Option "${option}" already exists.`;
            }
            poll.set(option, new Set());
            return `Option "${option}" added to the poll.`;
        }

        // Function to vote for an option
        function vote(option, voterId) {
            if (!poll.has(option)) {
                return `Option "${option}" does not exist.`;
            }
            const voters = poll.get(option);
            if (voters.has(voterId)) {
                return `Voter ${voterId} has already voted for "${option}".`;
            }
            voters.add(voterId);
            return `Voter ${voterId} voted for "${option}".`;
        }

        // Function to display the poll results
        function displayResults() {
            let result = "Poll Results:";
            for (let [option, voters] of poll.entries()) {
                result += `\n${option}: ${voters.size} votes`;
            }
            return result;
        }

        // Initialize with sample data (required: at least 3 options and 3 votes)
        addOption("Turkey");
        addOption("Morocco");
        addOption("Algeria");
        vote("Turkey", "traveler1");
        vote("Morocco", "traveler2");
        vote("Algeria", "traveler3");

        // UI Helper Functions
        function showMessage(elementId, message, type = 'info') {
            const element = document.getElementById(elementId);
            element.innerHTML = `<div class="message ${type}">${message}</div>`;
            setTimeout(() => {
                element.innerHTML = '';
            }, 3000);
        }

        function handleAddOption() {
            const input = document.getElementById('optionInput');
            const option = input.value.trim();
            const result = addOption(option);
            
            if (result.includes('added')) {
                showMessage('addOptionMessage', result, 'success');
                input.value = '';
                updateUI();
            } else {
                showMessage('addOptionMessage', result, 'error');
            }
        }

        function handleVote() {
            const voterIdInput = document.getElementById('voterIdInput');
            const optionSelect = document.getElementById('voteOptionSelect');
            const voterId = voterIdInput.value.trim();
            const option = optionSelect.value;

            if (!voterId) {
                showMessage('voteMessage', 'Please enter your Voter ID', 'error');
                return;
            }

            if (!option) {
                showMessage('voteMessage', 'Please select an option', 'error');
                return;
            }

            const result = vote(option, voterId);
            
            if (result.includes('voted for')) {
                showMessage('voteMessage', result, 'success');
                voterIdInput.value = '';
                optionSelect.value = '';
                updateUI();
            } else {
                showMessage('voteMessage', result, result.includes('already voted') ? 'error' : 'error');
            }
        }

        function updateUI() {
            updateOptionsList();
            updateVoteSelect();
            updateResults();
            updateStats();
        }

        function updateOptionsList() {
            const list = document.getElementById('optionsList');
            if (poll.size === 0) {
                list.innerHTML = '<li style="text-align: center; color: var(--color-text-secondary);">No options added yet</li>';
                return;
            }

            list.innerHTML = '';
            for (let [option, voters] of poll.entries()) {
                const li = document.createElement('li');
                li.className = 'option-item';
                li.innerHTML = `
                    <span class="option-name">${option}</span>
                    <span class="vote-count">${voters.size} vote${voters.size !== 1 ? 's' : ''}</span>
                `;
                list.appendChild(li);
            }
        }

        function updateVoteSelect() {
            const select = document.getElementById('voteOptionSelect');
            select.innerHTML = '<option value="">Select an option</option>';
            
            for (let [option] of poll.entries()) {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                select.appendChild(optionElement);
            }
        }

        function updateResults() {
            const resultsDiv = document.getElementById('resultsDisplay');
            
            if (poll.size === 0) {
                resultsDiv.innerHTML = '<p style="text-align: center; opacity: 0.8;">No votes cast yet</p>';
                return;
            }

            let totalVotes = 0;
            for (let [, voters] of poll.entries()) {
                totalVotes += voters.size;
            }

            if (totalVotes === 0) {
                resultsDiv.innerHTML = '<p style="text-align: center; opacity: 0.8;">No votes cast yet</p>';
                return;
            }

            resultsDiv.innerHTML = '';
            
            for (let [option, voters] of poll.entries()) {
                const percentage = totalVotes > 0 ? (voters.size / totalVotes * 100).toFixed(1) : 0;
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <strong>${option}</strong>
                            <span>${voters.size} vote${voters.size !== 1 ? 's' : ''} (${percentage}%)</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
                resultsDiv.appendChild(resultItem);
            }
        }

        function updateStats() {
            let totalVotes = 0;
            const allVoters = new Set();
            
            for (let [, voters] of poll.entries()) {
                totalVotes += voters.size;
                voters.forEach(voter => allVoters.add(voter));
            }

            document.getElementById('totalOptions').textContent = poll.size;
            document.getElementById('totalVotes').textContent = totalVotes;
            document.getElementById('uniqueVoters').textContent = allVoters.size;
        }

        // Handle Enter key for inputs
        document.getElementById('optionInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAddOption();
        });

        document.getElementById('voterIdInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleVote();
        });

        // Initialize UI with sample data
        updateUI();

        // Console output for testing
        console.log(displayResults());
