"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="p-6 text-center space-y-4">
          <h1 className="text-2xl font-bold text-green-600">🎉 خوش آمدید!</h1>
          <p className="text-gray-700 text-sm">
            به سامانه مدیریت بیمه تکمیلی خوش آمدید.
            <br />
            از منوی بالا برای ادامه استفاده کنید.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
