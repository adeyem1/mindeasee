import React from "react";
import Link from "next/link";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="bg-primary dark:bg-primary/50 text-white border-t border-white/10c py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MindEase</h3>
            <p className="text-white/70">
              Your partner in mental wellness, providing compassionate support on your journey.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/resources"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/therapists"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Find Therapists
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  AI Chat
                </Link>
              </li>
              <li>
                <Link
                  href="/mood-tracker"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Mood Tracker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Help & Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Crisis Resources
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="h-6 w-6" />
              </a>
            </div>
            <p className="text-white/70">
              &copy; {new Date().getFullYear()} MindEase. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
