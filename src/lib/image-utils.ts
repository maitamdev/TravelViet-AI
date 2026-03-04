export function getUnsplashUrl(query: string, width = 800, height = 400): string {
  return 'https://source.unsplash.com/' + width + 'x' + height + '/?vietnam,' + encodeURIComponent(query);
}

export function getPlaceholderAvatar(name: string): string {
  return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=random&color=fff&size=128';
}

export function getMapThumbnail(lat: number, lng: number, zoom = 13): string {
  return 'https://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lng +
    '&zoom=' + zoom + '&size=400x200&maptype=roadmap';
}
