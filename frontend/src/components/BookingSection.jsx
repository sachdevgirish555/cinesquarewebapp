import React from "react";

const BookingSection = () => {
  return (
    <div className="w-full bg-black">
      <iframe
        title="Quick Booking"
        scrolling="Auto"
        height="500"
        width="100%"
        frameBorder="0"
        allowtransparency="true"
        src="https://cinemas.bookmyshow.com/iframe?domain=www.cinesquare.in"
        className="block h-[500px] w-full sm:h-[520px] md:h-[540px]"
      ></iframe>
    </div>
  );
};

export default BookingSection;
