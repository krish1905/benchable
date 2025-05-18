/**
 * This file sets up basic polyfills for Node.js modules in React Native
 */
import 'react-native-url-polyfill/auto';

// TextEncoder/TextDecoder polyfills
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = function TextEncoder() {};
  global.TextEncoder.prototype.encode = function encode(str) {
    const buf = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      buf[i] = str.charCodeAt(i) & 0xff;
    }
    return buf;
  };
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = function TextDecoder() {};
  global.TextDecoder.prototype.decode = function decode(buf) {
    let str = '';
    for (let i = 0; i < buf.length; i++) {
      str += String.fromCharCode(buf[i]);
    }
    return str;
  };
}

// Simple crypto polyfill
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
  };
}

// Empty polyfill for stream
if (!global.stream) {
  global.stream = {};
} 