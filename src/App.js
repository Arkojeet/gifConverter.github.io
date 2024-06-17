import React, { useState, useEffect } from "react"; 
import "./App.css"; 
// import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util';
import { Button } from "./components/Button"; 
import { Inputfile } from "./components/Inputfile"; 
import { Header } from "./components/Header"; 
import { Resultimg } from "./components/Resultimage"; 
import { Inputvideo } from "./components/Inputvideo"; 
import { Dbutton } from "./components/Dbutton"; 

// Create the FFmpeg instance and load it 
// const ffmpeg = createFFmpeg({ log: true });
const ffmpeg = new FFmpeg();

function App() { 
const [ready, setReady] = useState(false); 
const [video, setVideo] = useState(); 
const [gif, setGif] = useState(); 

const load = async () => { 
	await ffmpeg.load({log: true}); 
	setReady(true); 
}; 

useEffect(() => { 
	load(); 
}, []); 

const convertToGif = async () => { 
	// Write the .mp4 to the FFmpeg file system 
	await ffmpeg.writeFile("video1.mp4", await fetchFile(video)); 
	
	// Run the FFmpeg command-line tool, converting 
	// the .mp4 into .gif file 
	await ffmpeg.exec([ 
	"-i", 
	"video1.mp4", 
	"-t", 
	"2.5", 
	"-ss", 
	"2.0",
	"-f", 
	"gif", 
	"out.gif"]
	); 
	// Read the .gif file back from the FFmpeg file system 
	const data = await ffmpeg.readFile("out.gif"); 
	const url = URL.createObjectURL( 
	new Blob([data.buffer], { type: "image/gif" }) 
	); 
	setGif(url); 
}; 

const download = (e) => { 
	console.log(e.target.href); 
	fetch(e.target.href, { 
	method: "GET", 
	headers: {}, 
	}) 
	.then((response) => { 
		response.arrayBuffer().then(function (buffer) { 
		const url = window.URL.createObjectURL(new Blob([buffer])); 
		const link = document.createElement("a"); 
		link.href = url; 
		link.setAttribute("download", "image.gif"); 
		document.body.appendChild(link); 
		link.click(); 
		}); 
	}) 
	.catch((err) => { 
		console.log(err); 
	}); 
}; 

return ready ? ( 
	<div className="App"> 
	<Header /> 
	{video && <Inputvideo video={video} />} 
	<Inputfile setVideo={setVideo} /> 
	<Button convertToGif={convertToGif} /> 
	<h1>Result</h1> 
	{gif && <Resultimg gif={gif} />} 
	{gif && <Dbutton gif={gif} download={download} />} 
	</div> 
) : ( 
	
<p>Loading...</p> 

); 
} 

export default App;
