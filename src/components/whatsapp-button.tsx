import Link from 'next/link';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.4,16.2C18.1,17.4,17.1,18,16.5,18.2C16,18.3,15.3,18.4,13.9,17.8C12.1,17.1,10.7,15.8,9.6,14.4C8.4,12.8,7.7,11,7.9,9.8C8,8.8,8.5,8,8.8,7.7C9.1,7.4,9.4,7.3,9.7,7.3C10,7.3,10.2,7.3,10.4,7.4C10.7,7.5,10.9,7.7,11.1,8.1L11.6,9.1C11.7,9.4,11.7,9.6,11.6,9.8C11.6,10,11.5,10.1,11.3,10.3L11,10.6C10.9,10.7,10.8,10.8,10.9,11C11,11.3,11.2,11.6,11.5,12C12.2,12.8,12.9,13.4,13.8,13.8C14,13.9,14.1,13.8,14.2,13.7L14.5,13.4C14.8,13.2,15.1,13.1,15.4,13.2C15.8,13.4,16.6,13.8,16.8,14C17,14.1,17.1,14.3,17.2,14.5C17.2,14.8,17.2,15,17.1,15.2L16.8,15.8C16.6,16,16.4,16.1,16.2,16.2H16.1C16.1,16.2,16.1,16.2,16.2,16.2C16.2,16.2,18.6,16.3,18.4,16.2ZM12,2C6.5,2,2,6.5,2,12C2,14.2,2.8,16.3,4.1,17.9L3,21L6.2,19.9C7.7,20.8,9.8,21.3,12,21.3C17.5,21.3,22,16.8,22,11.3C22,5.8,17.5,2,12,2Z"
    />
  </svg>
);

export function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/254748809701"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="w-8 h-8" />
    </Link>
  );
}
