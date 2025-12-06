export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">
          © {currentYear} 個人ブログサイト. All rights reserved.
        </p>
      </div>
    </footer>
  );
}




