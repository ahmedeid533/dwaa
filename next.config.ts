import type {NextConfig}
from "next";

const nextConfig: NextConfig = {
	images: { // This new property enables SVGs
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn11.bigcommerce.com',
				port: '',
				pathname: '/**'
			}, {
				protocol: 'https',
				hostname: 'placehold.co',
				port: '',
				pathname: '/**'
			}, {
				protocol: 'https',
				hostname: '*', // Replace with your actual hostname
				port: '',
				pathname: '/**'
			}
		]
	},

	webpack(config) {
		config.module.rules.push({test: /\.svg$/, use: ["@svgr/webpack"]});
		return config;
	}
};

export default nextConfig;
