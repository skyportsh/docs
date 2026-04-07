// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeBlack from 'starlight-theme-black'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			customCss: ['/src/styles/fonts.css'],
			plugins: [
				starlightThemeBlack({
				  footerText:
					'Built by MJF (Matt James Foundation) and our community. Skyport is nothing without its people. Thank you to all our contributors and users.'
				})
			],
			title: 'Skyport',
			logo: {
				src: './src/assets/skyport.png',
			},
			favicon: './src/assets/skyport.png',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/skyportsh' }],
			sidebar: [
				{
					label: 'Project Information',
					items: [
						{ label: 'Introduction', slug: '' },
						{ label: 'About', slug: 'project/about' },
						{ label: 'Terminology', slug: 'project/terminology' },
						{ label: 'Community Standards', slug: 'project/community' },
					],
				},
				{
					label: 'Panel',
					items: [
						{ label: 'Getting Started', slug: 'panel/getting-started' },
						{ label: 'Webserver Configuration', slug: 'panel/webserver-configuration' },
						{ label: 'Additional Configuration', slug: 'panel/additional-configuration' },
						{ label: 'Updating the Panel', slug: 'panel/updating' },
						{ label: 'Troubleshooting', slug: 'panel/troubleshooting' },
					],
				},
				{
					label: 'Daemon',
					items: [
						{ label: 'Installing skyportd', slug: 'daemon/installing' },
						{ label: 'Upgrading skyportd', slug: 'daemon/upgrading' },
						{ label: 'Additional Configuration', slug: 'daemon/configuration' },
					],
				},
				{
					label: 'Tutorials',
					items: [
						{ label: 'Setting up PostgreSQL', slug: 'tutorials/postgresql-setup' },
						{ label: 'Creating SSL Certificates', slug: 'tutorials/creating-ssl-certificates' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Creating Your First Location and Node', slug: 'guides/first-location-and-node' },
					],
				},
			],
		}),
	],
});
