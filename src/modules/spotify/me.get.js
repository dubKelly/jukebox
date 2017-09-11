// get /me's playlists

export const getMePlaylists = (tokens, userHref) => {
	$.ajax({
		url: `${userHref}/playlists`,
		headers: {
			"Authorization": `${tokens.token_type} ${tokens.access_token}`
		},
		success: (response) => {
			const items = response.items;
			let playlists = [];

			for (let i = items.length - 1; i >= 0; i--) {
				let key = `playlist${i}`;
				let playlist =	<div className="playlist" key={key}>
													<img 
														src={ items[i].images[2].url }
														alt=""
														data-href={ items[i].href }
														onClick={ this.getTracks } />
													<h2
														data-href={ items[i].href }
														onClick={ this.getTracks }>
														{ items[i].name }
													</h2>
												</div>
				playlists.push(playlist);
			}
			this.setState({ playlists });
		}
	});
}

// get a playlists tracks onClick

getPlaylistsTracks(tokens, e) {
	let targetHref = e.target.getAttribute("data-href");
	
	$.ajax({
		url: `${targetHref}/tracks`,
		headers: {
			"Authorization": `${tokens.token_type} ${tokens.access_token}`
		},
		success: (response) => {
			this.setState({ tracks: response });
		}
	});
}
