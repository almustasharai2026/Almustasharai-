#!/bin/bash

# Script to verify Vercel deployment
# Run this after deployment is complete

echo "================================"
echo "Vercel Deployment Verification"
echo "================================"
echo ""

# The project should be deployed at one of these URLs:
echo "🔗 Your project is deployed at one of these URLs:"
echo ""
echo "Primary (most likely):"
echo "  https://almustasharai.vercel.app"
echo ""
echo "Alternative:"
echo "  https://almustasharai-.vercel.app"
echo ""
echo "Check your Vercel dashboard for the exact URL:"
echo "  https://vercel.com/dashboard"
echo ""
echo "================================"
echo "Testing Endpoints"
echo "================================"
echo ""

# Function to test endpoint
test_endpoint() {
  local url=$1
  local path=$2
  
  echo "Testing: $url$path"
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url$path")
  
  if [ "$status" = "200" ] || [ "$status" = "404" ] || [ "$status" = "405" ]; then
    echo "  ✓ Endpoint is reachable (HTTP $status)"
  elif [ "$status" = "000" ]; then
    echo "  ✗ Cannot reach server - URL might be incorrect"
  else
    echo "  ? HTTP Status: $status"
  fi
  echo ""
}

# If you know your URL, uncomment and update this:
# BASE_URL="https://your-vercel-url.vercel.app"

# Uncomment the lines below after you know your URL:
# test_endpoint "$BASE_URL" "/"
# test_endpoint "$BASE_URL" "/api/personas"
# test_endpoint "$BASE_URL" "/api/login"

echo "================================"
echo "Manual Testing Steps"
echo "================================"
echo ""
echo "1. Open your Vercel dashboard: https://vercel.com/dashboard"
echo "2. Select the 'Almustasharai' project"
echo "3. Find the Production URL (e.g., almustasharai.vercel.app)"
echo "4. Visit that URL in your browser"
echo "5. Test login with:"
echo "   Email: bishoysamy390@gmail.com"
echo "   Password: Bishoysamy2020"
echo ""
echo "If deployed successfully, you should see:"
echo "  ✓ Homepage loads"
echo "  ✓ Login page works"
echo "  ✓ Can submit login form"
echo "  ✓ Dashboard appears for authorized users"
echo ""
