/* global $, JitsiMeetJS */

const options = {
    hosts: {
       domain: 'meet.jit.si',
       muc: 'conference.meet.jit.si', 
       focus: 'focus.meet.jit.si',
    }, 
    externalConnectUrl: 'https://meet.jit.si/http-pre-bind', 
    enableP2P: true, 
    p2p: { 
       enabled: true, 
       preferH264: true, 
       disableH264: true, 
       useStunTurn: true,
    }, 
    useStunTurn: true, 
    bosh: 'https://meet.jit.si/http-bind?room=' + new URL(window.location.href).searchParams.get("n"), 
    websocket: 'wss://meet.jit.si/xmpp-websocket', 
    clientNode: 'http://jitsi.org/jitsimeet', 
   }

const confOptions = {
    openBridgeChannel: true
};

let connection = null;
let isJoined = false;
let room = null;

let localTracks = [];
const remoteTracks = {};

const names = {};
/**
 * Handles local tracks.
 * @param tracks Array with JitsiTrack objects
 */
function onLocalTracks(tracks) {
    localTracks = tracks;
    for (let i = 0; i < localTracks.length; i++) {
        localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
            audioLevel => console.log(`Audio Level local: ${audioLevel}`));
        localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
            () => console.log('local track muted'));
        localTracks[i].addEventListener(
            JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
            () => console.log('local track stoped'));
        localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
            deviceId =>
                console.log(
                    `track audio output device was changed to ${deviceId}`));
        if (localTracks[i].getType() === 'video') {
            $('body').append(`<video autoplay='1' id='localVideo${i}' />`);
            localTracks[i].attach($(`#localVideo${i}`)[0]);
        } else {
            $('body').append(
                `<audio autoplay='1' muted='true' id='localAudio${i}' />`);
            localTracks[i].attach($(`#localAudio${i}`)[0]);
        }
        if (isJoined) {
            room.addTrack(localTracks[i]);
        }
    }
}

/**
 * Handles remote tracks
 * @param track JitsiTrack object
 */
function onRemoteTrack(track) {
    if (track.isLocal()) {
        return;
    }
    const participant = track.getParticipantId();
    const participantname = room.getParticipantById(participant);
    console.log("asdasd " + participantname);

    if (!remoteTracks[participant]) {
        remoteTracks[participant] = [];
    }
    const idx = remoteTracks[participant].push(track);

    track.addEventListener(
        JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
        audioLevel => console.log(`Audio Level remote: ${audioLevel}`));
    track.addEventListener(
        JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
        () => console.log('remote track muted'));
    track.addEventListener(
        JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
        () => console.log('remote track stoped'));
    track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
        deviceId =>
            console.log(
                `track audio output device was changed to ${deviceId}`));
    const id = participant + track.getType() + idx;

    if (track.getType() === 'video') {
      
    } else {
        $('body').append(`<audio autoplay='1' id='${participant}audio${idx}' />`);
        $('.row').append(`<div class="col-md-2 col-sm-2 mb">
        <div class="darkblue-panel pn"  id=${participant}>
          <div class="darkblue-header">
            <h5>${names[participant]}</h5>
          </div>
          <h1 class="mt"><i class="fa fa-user fa-3x"></i></h1>
          <footer>
            <div class="centered">
            <h4 id=time${participant}>Time: 0ms</h4>
            </div>
          </footer>
        </div>

      </div>`);
		
		
    }
    track.attach($(`#${id}`)[0]);
}

/**
 * That function is executed when the conference is joined
 */
function onConferenceJoined() {
    console.log('conference joined!');
    isJoined = true;
    for (let i = 0; i < localTracks.length; i++) {
        room.addTrack(localTracks[i]);
    }
}

/**
 *
 * @param id
 */
function onUserLeft(id) {
    console.log('user left');
    if (!remoteTracks[id]) {
        return;
    }
    const tracks = remoteTracks[id];

    for (let i = 0; i < tracks.length; i++) {
        tracks[i].detach($(`#${id}${tracks[i].getType()}`));
    }
}

/**
 * That function is called when connection is established successfully
 */
function onConnectionSuccess() {
    console.log(new URL(window.location.href).searchParams.get("n"));
    room = connection.initJitsiConference(new URL(window.location.href).searchParams.get("n"), confOptions);
    room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
    room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, track => {
        console.log(`track removed!!!${track}`);
    });
    room.on(
        JitsiMeetJS.events.conference.CONFERENCE_JOINED,
        onConferenceJoined);
    room.on(JitsiMeetJS.events.conference.USER_JOINED, (id , user)=> {
        console.log('user join' + user.getDisplayName());
        remoteTracks[id] = [];
        names[id] = user.getDisplayName();
    });
    room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
    room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
        console.log(`${track.getType()} - ${track.isMuted()}`);
    });
    room.on(
        JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
        (userID, displayName) => console.log(`${userID} - ${displayName}`));
    room.on(
        JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
        (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`));
    room.on(
        JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED,
        () => console.log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`));
    room.join(new URL(window.location.href).searchParams.get("p"));
}

/**
 * This function is called when the connection fail.
 */
function onConnectionFailed() {
    console.error('Connection Failed!');
}

/**
 * This function is called when the connection fail.
 */
function onDeviceListChanged(devices) {
    console.info('current devices', devices);
}

/**
 * This function is called when we disconnect.
 */
function disconnect() {
    console.log('disconnect!');
    connection.removeEventListener(
        JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
        onConnectionSuccess);
    connection.removeEventListener(
        JitsiMeetJS.events.connection.CONNECTION_FAILED,
        onConnectionFailed);
    connection.removeEventListener(
        JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
        disconnect);
}

/**
 *
 */
function unload() {
    for (let i = 0; i < localTracks.length; i++) {
        localTracks[i].dispose();
    }
    room.leave();
    connection.disconnect();
}

function startVAD(){
    console.log( "comecou");
	var keys = Object.keys(remoteTracks);

	for(var i=0;i<keys.length;i++){
		
		if(remoteTracks[keys[i]].length>0 && remoteTracks[keys[i]][0].getType() != 'video'){	
			const u = keys[i];
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			const audioCtx = new window.AudioContext();
			let options1 = {
			  mediaStream : remoteTracks[keys[i]][0].stream
			}
     
            console.log(room.getParticipantById(u)._displayName)
			let source = new MediaStreamAudioSourceNode(audioCtx, options1);
            let recorder ;
          
            var totalTime=0;
            var t0, t1;
			var options = {
                source: source,
                voice_stop: function() {
                  t1 = performance.now()
                  totalTime +=  (t1-t0);
                  console.log( Math.round( totalTime/1000));
                  document.getElementById("time"+u).innerHTML = "time: " +  Math.floor( totalTime/1000/60) + " min " + (Math.floor( totalTime/1000) - Math.floor( totalTime/1000/60) * 60)   + "s";
                  document.getElementById(u).style.backgroundColor = '#444c57' ;

                 recorder.stopRecording(() => {
                    var blob = recorder.getBlob();
                    recorder.destroy();
                    // getting unique identifier for the file name
                    var fileName = new URL(window.location.href).searchParams.get("n")+ "_" + room.getParticipantById(u)._displayName + "_" + Date.now() + '.wav ';
                    
                    var file = new File([blob], fileName, {
                        type: 'audio'
                    });

                    var formData = new FormData();
                    formData.append('file', file);
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "/uploadFile");
                    xhr.send(formData);
                });

                }, 
                voice_start: function() {
                    document.getElementById(u).style.backgroundColor = '#4ECDC4' ;
                     t0 = performance.now()
                     recorder = RecordRTC(options1.mediaStream, {
                        type: 'audio',
                        recorderType: StereoAudioRecorder,
                        desiredSampRate: 16000,
                        numberOfAudioChannels: 1 // your choice
                    });
                      recorder.startRecording();
                      //recorder.append()
                  
    
                   // console.log(u + "comecou");
                }
               };
			// Create VAD
			var vad = new VAD(options);
		
		}
	}
	
	
	
}

let isVideo = true;

/**
 *
 */
function switchVideo() { // eslint-disable-line no-unused-vars
    isVideo = !isVideo;
    if (localTracks[1]) {
        localTracks[1].dispose();
        localTracks.pop();
    }
    JitsiMeetJS.createLocalTracks({
        devices: [ isVideo ? 'video' : 'desktop' ]
    })
        .then(tracks => {
            localTracks.push(tracks[0]);
            localTracks[1].addEventListener(
                JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
                () => console.log('local track muted'));
            localTracks[1].addEventListener(
                JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
                () => console.log('local track stoped'));
            localTracks[1].attach($('#localVideo1')[0]);
            room.addTrack(localTracks[1]);
        })
        .catch(error => console.log(error));
}

/**
 *
 * @param selected
 */
function changeAudioOutput(selected) { // eslint-disable-line no-unused-vars
    JitsiMeetJS.mediaDevices.setAudioOutputDevice(selected.value);
}

$(window).bind('beforeunload', unload);
$(window).bind('unload', unload);

 JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
const initOptions = {
    disableAudioLevels: true
};

JitsiMeetJS.init(initOptions);

connection = new JitsiMeetJS.JitsiConnection(null, null, options);

connection.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
    onConnectionSuccess);
connection.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_FAILED,
    onConnectionFailed);
connection.addEventListener(
    JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
    disconnect);

JitsiMeetJS.mediaDevices.addEventListener(
    JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
    onDeviceListChanged);

connection.connect();

//JitsiMeetJS.createLocalTracks({ devices: [ 'audio', 'video' ] })
JitsiMeetJS.createLocalTracks({ devices: [  ] })
    .then(onLocalTracks)
    .catch(error => {
        throw error;
    });

if (JitsiMeetJS.mediaDevices.isDeviceChangeAvailable('output')) {
    JitsiMeetJS.mediaDevices.enumerateDevices(devices => {
        const audioOutputDevices
            = devices.filter(d => d.kind === 'audiooutput');

        if (audioOutputDevices.length > 1) {
            $('#audioOutputSelect').html(
                audioOutputDevices
                    .map(
                        d =>
                            `<option value="${d.deviceId}">${d.label}</option>`)
                    .join('\n'));

            $('#audioOutputSelectWrapper').show();
        }
    });
}
