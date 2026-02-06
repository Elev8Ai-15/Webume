export function getManifest() {
  return {
    name: 'Webumé - Digital Resume',
    short_name: 'Webumé',
    description: 'Transform your resume into an immersive digital experience. AI-powered resume parsing, interactive career timeline, 10 professional templates, and instant shareable profiles.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0a0a12',
    theme_color: '#1e3a5f',
    orientation: 'portrait-primary',
    dir: 'ltr',
    lang: 'en-US',
    prefer_related_applications: false,
    icons: [
      { src: '/static/icon-48.png', sizes: '48x48', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-72.png', sizes: '72x72', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-96.png', sizes: '96x96', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-128.png', sizes: '128x128', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-144.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-152.png', sizes: '152x152', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-256.png', sizes: '256x256', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-384.png', sizes: '384x384', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-1024.png', sizes: '1024x1024', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/static/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ],
    categories: ['business', 'productivity', 'lifestyle'],
    iarc_rating_id: '',
    screenshots: [],
    shortcuts: [
      {
        name: 'Upload Resume',
        short_name: 'Upload',
        description: 'Upload and parse your resume with AI',
        url: '/?action=upload',
        icons: [{ src: '/static/icon-96.png', sizes: '96x96', type: 'image/png' }]
      },
      {
        name: 'View Profile',
        short_name: 'Profile',
        description: 'Preview your digital resume',
        url: '/?action=preview',
        icons: [{ src: '/static/icon-96.png', sizes: '96x96', type: 'image/png' }]
      }
    ],
    related_applications: [],
    protocol_handlers: [],
    share_target: {
      action: '/',
      method: 'POST',
      enctype: 'multipart/form-data',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
        files: [
          {
            name: 'resume',
            accept: ['application/pdf', '.pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx', 'text/plain', '.txt']
          }
        ]
      }
    }
  }
}
