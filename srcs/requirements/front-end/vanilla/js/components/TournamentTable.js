import BaseTable from "@components/BaseTable";
import AbstractView from "@views/AbstractView";
import ActionButton from "@components/ActionButton";
import NormalButton from '@components/NormalButton';
import HostAvatar from '@components/HostAvatar';
import NumberOfPlayers from '@components/NumberOfPlayers';
import { makeApiRequest } from '@utils/makeApiRequest.js';
import { navigateTo } from '@utils/Router.js';
import easyFetch from "@utils/easyFetch";
import displayPopup from '@utils/displayPopup';


class TournamentTable extends BaseTable {
    constructor() {
        super();
        this.tournamentData = {};
        this.userName = '';
        this.setHeaders(['Tournament Name', 'Host', 'Number of Players', 'Players Per Match', 'Status', 'Action', 'Details']);
        this.applyColumnStyles = this.applyColumnStyles.bind(this);
        this.setTournamentData = this.setTournamentData.bind(this);
        this.parseTournamentData = this.parseTournamentData.bind(this); 
		this.createTournament = this.createTournament.bind(this);	
		this.joinTournament = this.joinTournament.bind(this);
		this.startTournament = this.startTournament.bind(this);
		this.unjoinTournament = this.unjoinTournament.bind(this);
		this.fetchTournamentData = this.fetchTournamentData.bind(this);
		this.fetchUserAvatar = this.fetchUserAvatar.bind(this);
        this.playTournament = this.playTournament.bind(this);

        this.processTournament = this.processTournament.bind(this);
        this.fetchTournamentParticipants = this.fetchTournamentParticipants.bind(this);

        this.startPeriodicUpdate = this.startPeriodicUpdate.bind(this);

        // Set up event listeners
        document.addEventListener('startTournament', this.handleStartTournament.bind(this));
        document.addEventListener('joinTournament', this.handleJoinTournament.bind(this));
        document.addEventListener('unjoinTournament', this.handleUnjoinTournament.bind(this));
        document.addEventListener('updateTournamentRow', this.handleUpdateRow.bind(this));
        document.addEventListener('playTournament', this.handlePlayTournament.bind(this));

    }

 
    //Method apply styles to the hable columns
    applyColumnStyles() {
        this.columnStyles = {
            tournamentName: {
                'font-weight': '700',
                'vertical-align': 'middle',
                'text-align': 'center',
            },
            host: {
                'display': 'block',
                'vertical-align': 'middle',
                'text-align': 'center',
                'color': '#008000',
            },
            nbrOfPlayersTournament: {
                'align-items': 'center',
                'vertical-align': 'middle',
                'text-align': 'center',
            },
            nbrOfPlayersMatch: {
                'align-items': 'center',
                'vertical-align': 'middle',
                'text-align': 'center',
            },
            state: {
                'align-items': 'center',
                'vertical-align': 'middle',
                'text-align': 'center',
            },
            action: {
                'align-items': 'center',
                'vertical-align': 'middle',
                'text-align': 'center',
                'cursor': 'pointer',
            },
            details: {
                'align-items': 'center',
                'vertical-align': 'middle',
                'text-align': 'center',
            },event
        };
    }

    async setTournamentData(tournamentData, userName) {
        this.tournamentData = tournamentData;
        this.userName = userName;
       
        this.sortTournaments();
        await this.parseTournamentData();
    }

    //Method to create a style HTMl object (e.g. a button)
    createStyledHTMLObject = (tagName, content, style) => {
        const element = document.createElement(tagName);
        if (typeof content === 'string') {
            element.innerHTML = content;
        } else if (content instanceof Node) {
            element.appendChild(content);
        }

        //Apply styles
        Object.assign(element.style, style);
        return element;
    }

    async parseTournamentData() {
        const tournaments = this.tournamentData;
        for (let tournament of tournaments) {
            try {
                await this.processTournament(tournament);
            } catch (error) {
                console.error('Failed to process tournament:', error);
                displayPopup('Action failed: ' + error, 'error');
            }
        }
    }

    async processTournament(tournament) {
        const participants = await this.fetchTournamentParticipants(tournament.id);
        tournament.is_in_tournament = participants.players_username.includes(this.userName);
    
        const tournamentNameElement = this.createTournamentNameElement(tournament);
        const hostElement = await this.createHostElement(tournament.host_name);
        const numberOfPlayersElement = this.createNumberOfPlayersElement(tournament);
        const numberOfPlayerPerMatch = this.createNumberOfPlayerPerMatchElement(tournament);
        const tournamentStatus = this.createTournamentStatusElement(tournament);
        const actionButtonElement = this.createActionButtonElement(tournament);
        const tournamentDetails = this.createTournamentDetailsElement(tournament);
    
        this.addRow([
            tournamentNameElement,
            hostElement,
            numberOfPlayersElement,
            numberOfPlayerPerMatch,
            tournamentStatus,
            actionButtonElement,
            tournamentDetails
        ],
            tournament.id);
    }
    
    async fetchTournamentParticipants(tournamentID) {
        try {
            const response = await makeApiRequest(`/api/tournament/${tournamentID}/participants/`, 'GET');
            const participants = response.body;
            return participants;
        } catch (error) {
            console.error('Failed to fetch tournament participants:', error);
            displayPopup('Action failed: ' + error, 'error');
            return '';
        }

    }
    //Method to sortTournaments
    sortTournaments() {
        this.tournamentData.sort((a, b) => {
            if (a.state === 'waiting' && (b.state === 'started' || b.state === 'ended')) return -1;
            if ((a.state === 'started' || a.state === 'ended') && b.state === 'waiting') return 1;
            return 0;
        });
    }
    
	async createTournament() {
		navigateTo('/create-tournament');
	}

	async joinTournament(tournamentID) {
		let userID;
	
		// Attempt to fetch user details
		try {
			const responseUser = await makeApiRequest(`/api/user_management/auth/getUser`, 'GET');
			if (responseUser.status >= 400) { 
				throw new Error('Failed to fetch user details.');
			}
			userID = responseUser.body.user_id;
		} catch (error) {
			console.error('Error fetching user details:', error);
			displayPopup(error.message, 'error');
			return;
		}
		// Attempt to add player to tournament
		try {
			const apiEndpoint = `/api/tournament/add-player/${tournamentID}/${userID}/`;
			const response = await makeApiRequest(apiEndpoint, 'POST');
			if (response.status >= 400) { 
				throw new Error('Failed to join tournament: ' + response.errorMessage);
			}
			displayPopup('Successfully joined the tournament!', 'success');
		} catch (error) {
			console.error('Error joining tournament:', error);
			displayPopup(error.message, 'error');
		}
	}
	
	async startTournament(tournamentID) {
		try {
			const apiEndpoint = `/api/tournament/${tournamentID}/start/`;
			const response = await makeApiRequest(apiEndpoint, 'POST');
			if (response.status >= 400) { 
				throw new Error('Failed to start tournament: ' + response.errorMessage);
			}
			displayPopup('Successfully started the tournament!', 'success');
		} catch (error) {
			console.error('Error starting tournament:', error);
			displayPopup(error.message, 'error');
		}

	}

	async unjoinTournament(tournamentName, tournamentID) {
		try {
			const apiEndpoint = `/api/tournament/unjoin/${tournamentID}/${this.userName}/`;
			const response = await makeApiRequest(apiEndpoint, 'POST');
			if (response.status >= 400) { 
				throw new Error('Failed to unjoin ' + tournamentName + ' tournament: ' + response.errorMessage);
			}
			displayPopup('Successfully unjoined the ' + tournamentName + ' tournament!', 'success');
		} catch (error) {
			console.error('Error unjoining ' + tournamentName + ' tournament:', error);
			displayPopup(error.message, 'error');
		}
	}

	async fetchTournamentData(tournamentID) {
		try {
			const response = await makeApiRequest(`/api/tournament/${tournamentID}/tournament`, 'GET');
			console.log(response.body);
			if (response.status >= 400) {
				throw new Error('Failed to fetch tournament data: ' + response.errorMessage);
			}
			return response.body;
		} catch (error) {
			console.error('Error fetching tournament data:', error);
			displayPopup(error.message, 'error');
			return null;
		}
		
	}

	async fetchUserAvatar(username) {
		try {
			const response = await makeApiRequest(`/api/user_management/auth/detail/${username}`, 'GET');
			if (response.status >= 400) { 
				throw new Error('Failed to fetch user avatar.');
			}
			let avatar = response.body.avatar;
			const src = "/api/user_management" + avatar;
			return src;
		} catch (error) {
			console.error('Error fetching user avatar:', error);
			return null;
		}
	}

    createTournamentNameElement(tournament) {
        let tournamentNameElement = this.createStyledHTMLObject('div', tournament.tournament_name, this.columnStyles.tournamentName);
        tournamentNameElement.header = 'Tournament Name';
        return tournamentNameElement;
    }
    
    async createHostElement(hostName) {
        const hostAvatar = await this.fetchUserAvatar(hostName);
        const hostAvatarElement = document.createElement('host-avatar');
        hostAvatarElement.setAttribute('name', hostName);
        if (hostAvatar)
            hostAvatarElement.setAttribute('avatar', hostAvatar);
        const styledElement = this.createStyledHTMLObject('div', hostAvatarElement, this.columnStyles.host);
        styledElement.header = 'Host';
        return styledElement;
    }
    
    createNumberOfPlayersElement(tournament) {
        const styledElement = this.createStyledHTMLObject('div', `${tournament.joined}/${tournament.nbr_of_player_total}`, this.columnStyles.nbrOfPlayersTournament);
        styledElement.header = 'Number of Players';
        return styledElement;
    }
    
    createNumberOfPlayerPerMatchElement(tournament) {
        const componentNbrOfPlayers = document.createElement('number-of-players');
        componentNbrOfPlayers.setAttribute('nbrOfPlayers', tournament.nbr_of_player_match);
        const styledElement = this.createStyledHTMLObject('div', componentNbrOfPlayers, this.columnStyles.nbrOfPlayersMatch);
        styledElement.header = 'Players Per Match';
        return styledElement;
    }
    
    createTournamentStatusElement(tournament) {
        const styledElement = this.createStyledHTMLObject('div', tournament.state, this.columnStyles.state);
        styledElement.header = 'Status';
        return styledElement;
    }

    createActionButtonElement(tournament) {
        let buttonText = '';
        let buttonEvent = null;
    
        // Create the button
        const actionButton = this.createStyledHTMLObject('button', '', this.columnStyles.action);
        actionButton.header = 'Action';
    
        if (tournament.host_name === this.userName && tournament.state === 'waiting') {
            buttonText = 'Start';
            buttonEvent = async () => {
                await this.performAction('startTournament', tournament.id);
                document.dispatchEvent(new CustomEvent('updateTournamentRow', { detail: { tournamentId: tournament.id } }));
            };
        } else if (tournament.is_in_tournament && tournament.state === 'started') {
            buttonText = 'Play';
			buttonEvent = async () => {
                await this.performAction('playTournament', tournament.id);
                //document.dispatchEvent(new CustomEvent('updateTournamentRow', { detail: { tournamentId: tournament.id } }));
            };
        } else if (tournament.is_in_tournament && tournament.state === 'waiting') {
            buttonText = 'Unjoin';
            buttonEvent = async () => {
                await this.performAction('unjoinTournament', tournament.id, tournament.tournament_name);
                document.dispatchEvent(new CustomEvent('updateTournamentRow', { detail: { tournamentId: tournament.id } }));
            };
        } else {
            buttonText = 'Join';
            buttonEvent = async () => {
                await this.performAction('joinTournament', tournament.id);
                document.dispatchEvent(new CustomEvent('updateTournamentRow', { detail: { tournamentId: tournament.id } }));
            };
        }
    
        actionButton.textContent = buttonText;
        if (buttonEvent) {
            actionButton.onclick = buttonEvent;
        }
    
        return actionButton;
    }

    createTournamentDetailsElement(tournament) {
        const tournamentDetails = this.createStyledHTMLObject('button', '👁️', this.columnStyles.details);
        tournamentDetails.addEventListener('click', () => navigateTo(`/brackets?tournament=${tournament.id}`));
        tournamentDetails.header = 'Details';
        return tournamentDetails;
    }
    
    handleStartTournament(event) {
        const { tournamentId } = event.detail;
        this.startTournament(tournamentId);
    }
    
    handleJoinTournament(event) {
        const { tournamentId } = event.detail;
        this.joinTournament(tournamentId);
    }
    
    handleUnjoinTournament(event) {
        const { tournamentId, tournamentName } = event.detail;
        this.unjoinTournament(tournamentName, tournamentId);
    }

    handlePlayTournament(event) {
        const { tournamentId } = event.detail;
        this.playTournament(tournamentId);
    }

    async performAction(actionType, tournamentId, tournamentName = '') {
        document.dispatchEvent(new CustomEvent(actionType, { detail: { tournamentId, tournamentName } }));
        
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    async handleUpdateRow(event) {
        const { tournamentId } = event.detail;
        const tournament = await this.fetchTournamentData(tournamentId);
        if (tournament) {
            const participants = await this.fetchTournamentParticipants(tournament.id);
            tournament.is_in_tournament = participants.players_username.includes(this.userName);
        
            const tournamentNameElement = this.createTournamentNameElement(tournament);
            const hostElement = await this.createHostElement(tournament.host_name);
            const numberOfPlayersElement = this.createNumberOfPlayersElement(tournament);
            const numberOfPlayerPerMatch = this.createNumberOfPlayerPerMatchElement(tournament);
            const tournamentStatus = this.createTournamentStatusElement(tournament);
            const actionButtonElement = this.createActionButtonElement(tournament);
            const tournamentDetails = this.createTournamentDetailsElement(tournament);

            const newCellData = [ tournamentNameElement, hostElement, numberOfPlayersElement, numberOfPlayerPerMatch, tournamentStatus, actionButtonElement, tournamentDetails ];
            this.updateRowByIdentifier(tournamentId, newCellData);
        } else {
            console.error('Failed to fetch updated tournament data.');
        }
    }

    async playTournament(tournamentID) {
        // fetch tournament details
		let matches = null;
		try {
			const res = await easyFetch(`/api/tournament/${tournamentID}/matches/`);
            console.log("Playtournament: " + res);
			if (res.response.ok) {
				matches = res.body.matches
			} else {
				throw new Error(res.body.error || JSON.stringify(res.body));
			}
		} catch (error) {
			displayPopup(`Request Failed: ${error}`, 'error');
			return ;
		}
		// Find the first match that is playing and contains the specified username
		const match = matches.find(match => 
			match.state === "playing" && 
			match.players.some(player => player.username === this.userName)
		);
		// Return the id of the found match, or null if no match is found
		const matchID = match ? match.id : null;
		if (matchID == null) {
			displayPopup("No match for you!", "info");
			return ;
		}
		window.location.href = '/play?matchID=' + matchID;
    }

    startPeriodicUpdate() {
		const tournamentIdentifiers = Object.keys(this.rowIndexByIdentifier);
		let index = 0;
		let iterations = 0;

        const newName = "BANANA";
	

		const updateRow = () => {
			if (iterations < 10) {
				const identifier = tournamentIdentifiers[index];
				const newName = "BANANA" + index;
				let tournamentNameElement = this.createStyledHTMLObject('div', newName, this.columnStyles.tournamentName);
				tournamentNameElement.header = 'Tournament Name';
                const newCellData = [tournamentNameElement];
				console.log('i=[', identifier, '] newName=[', newName, ']');
				this.updateRowByIdentifier(identifier, newCellData);
	
				index = (index + 1) % tournamentIdentifiers.length;
				iterations++;
	
				setTimeout(updateRow, 1000);
			}
		};
	
		updateRow();
	}


}

customElements.define('tournament-table', TournamentTable);
export default TournamentTable;