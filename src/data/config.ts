const models = {
    "modelpath": "./assets/models/",
    "models":
    {
        "hammer": "hammer.glb",
        "drill": "drill.glb",
        "tapeMeasure": "tapeMeasure.glb"
    },
    "texturepath": "./assets/textures/",
    "textures": {},
}

const audiosettings = {
    "baseurl": "./assets/audio/",
    "audio":
    {
        "track_athmo": {
            "file": "trackAthmo.mp3",
            "type": "visualizer",
            "loop": true,
            "volume": 0.5,
            "start": 0.0,
            "length": 10.240
        },
        "track_base": {
            "file": "trackBase.mp3",
            "type": "visualizer",
            "loop": true,
            "volume": 0.5,
            "start": 0.0,
            "length": 11.494
        },
        "track_mid": {
            "file": "trackMid.mp3",
            "type": "visualizer",
            "loop": true,
            "volume": 0.5,
            "start": 13.0,
            "length": 11.494
        },
        "track_high": {
            "file": "trackHigh.mp3",
            "type": "visualizer",
            "loop": true,
            "volume": 0.5,
            "start": 26.0,
            "length": 11.494
        },
        "audiofiles": {
            "sndBeacon": {
                "file": "spriteSoundFx.mp3",
                "type": "ui",
                "loop": true,
                "volume": 0.5,
                "start": 2.0,
                "length": 0.5
            }
        }
    }
}

export { models, audiosettings }
