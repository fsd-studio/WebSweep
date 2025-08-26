'use client'

function GoogleMaps({className}) {
  return (
    <div className={className}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2716.0055448173084!2d17.89553761482238!3d47.09896196338392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47699be656958b85%3A0x47ecd389b8e4aa52!2sFSD%20Studio!5e0!3m2!1sen!2sbe!4v1756228319386!5m2!1sen!2sbe"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  )
}

export default GoogleMaps
