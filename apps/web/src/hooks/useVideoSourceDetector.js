import pb from '@/lib/pocketbaseClient.js';

/**
 * Utility hook/function to detect video source type and extract video ID/URL.
 * 
 * @param {Object} video - The video record from PocketBase
 * @returns {Object} { type: 'video'|'youtube'|'vimeo', src: string, isValid: boolean }
 */
export function useVideoSourceDetector(video) {
  if (!video) return { isValid: false };

  // 1. Direct video file check (MP4, WebM, etc.)
  if (video.video_file) {
    return {
      type: 'video',
      src: pb.files.getUrl(video, video.video_file),
      isValid: true
    };
  }

  // 2. R2-hosted video URL check
  if (video.r2_video_url) {
    return {
      type: 'video',
      src: video.r2_video_url,
      isValid: true
    };
  }

  // 3. URL check
  if (video.video_url) {
    const url = video.video_url.trim();

    // YouTube pattern match (handles youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID)
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return { type: 'youtube', src: ytMatch[1], isValid: true };
    }

    // Vimeo pattern match
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
    if (vimeoMatch && vimeoMatch[1]) {
      return { type: 'vimeo', src: vimeoMatch[1], isValid: true };
    }

    // Fallback: If it's exactly 11 chars, assume YouTube ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return { type: 'youtube', src: url, isValid: true };
    }
    
    // Fallback: If it's only numbers, assume Vimeo ID
    if (/^[0-9]+$/.test(url)) {
      return { type: 'vimeo', src: url, isValid: true };
    }
  }

  return { isValid: false };
}