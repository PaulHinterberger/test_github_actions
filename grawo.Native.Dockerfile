FROM kusumoto/docker-ionic-android-sdk

WORKDIR /usr/app/
COPY . .

######### IONIC ANDROID #########

# install node_modules #
RUN npm ci && \
 ionic cordova platform add android && \
 ionic cordova build --release -c grawo android --verbose && \
 jarsigner -verbose \
    -sigalg SHA1withRSA \
    -digestalg SHA1 \
    -keystore app-release-key.keystore \
    -storepass dipl4ph \
    -keypass dipl4ph \
    platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk \
    schnappapp && \
 ${ANDROID_HOME}/build-tools/26.0.2/zipalign \
    -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk app.apk

######### IONIC IOS #########

# RUN ionic cordova platform add ios