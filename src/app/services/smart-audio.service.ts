import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { DataService } from 'src/app/services/data.service';

interface Sound {
    key: string;
    asset: string;
    isNative: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class SmartAudioService {
    public sounds: Sound[] = [];
    public audioPlayer: HTMLAudioElement = new Audio();
    public forceWebAudio = true;

    constructor(private platform: Platform, private nativeAudio: NativeAudio, public data: DataService) {

    }

    preload(key: string, asset: string, replace?: boolean): void {
        // console.log('preload: ' + key + ', ' + asset);
        // console.log(this.sounds);
        if ((replace === undefined || replace === false) && this.sounds.find(v => v.key === key) !== undefined){
            console.log('Key ' + key + ' already preloaded!');
            return;
        }
        
        if (this.platform.is('cordova') && !this.forceWebAudio) {
            if(replace){
                this.nativeAudio.unload(key).then(() =>
                    this.nativeAudio.preloadSimple(key, asset)
                );
                this.replaceSound(key, asset);
            }
            else{
                this.nativeAudio.preloadSimple(key, asset);
                this.sounds.push({
                    key: key,
                    asset: asset,
                    isNative: true
                });
            }  
        } 
        else {
            if(replace){
                this.replaceSound(key, asset);
            }
            else{
                this.sounds.push({
                    key: key,
                    asset: asset,
                    isNative: false
                });
            }
        }
    }

    replaceSound(key: string, asset: string){
        var index = this.sounds.findIndex(s => s.key === key);
        if(index != -1){
            this.sounds.splice(index, 1, {
                key: key,
                asset: asset,
                isNative: false
            });
        }
        else{
            this.sounds.push({
                key: key,
                asset: asset,
                isNative: false
            });
        }
    }

    play(key: string): void {
        // console.log('play: ' + key);
        this.data.isAudioFinished = false;
        this.data.isAudioPlaying = true;
        const soundToPlay: Sound = this.sounds.find((sound) => {
            return sound.key === key;
        });
        
        if (soundToPlay === undefined){
            console.log('soundToPlay not found! ' + key);
            return;
        }

        if (soundToPlay.isNative) {
            this.nativeAudio.play(soundToPlay.asset, () => this.finishedPlaying()).then((res) => {
                console.log(res);
            }, (err) => {
                console.log(err);
            });

        } else {
            this.audioPlayer.src = soundToPlay.asset;
            this.audioPlayer.addEventListener('ended', () => {
                this.finishedPlaying();
            });
            //this.audioPlayer.muted = true;
            this.audioPlayer.play();
        }

    }

    isCurrentlyPlaying(): boolean {
        return !this.audioPlayer.paused;
    }

    finishedPlaying() {
        this.data.isAudioPlaying = false;
        this.data.isAudioFinished = true;
    }

    stop(key: string) {
        this.data.isAudioPlaying = false;
        const soundToPlay = this.sounds.find((sound) => {
            return sound.key === key;
        });

        if (soundToPlay.isNative) {

            this.nativeAudio.stop(soundToPlay.asset).then((res) => {
                console.log(res);
            }, (err) => {
                console.log(err);
            });

        } else {

            this.audioPlayer.src = soundToPlay.asset;
            this.audioPlayer.pause();

        }
    }
}
