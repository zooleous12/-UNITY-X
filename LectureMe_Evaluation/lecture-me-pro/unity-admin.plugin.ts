import { Plugin } from 'vite';

/**
 * Unity Ecosystem: Invisible Admin & Aegis Injection Plugin
 * Uses the transformIndexHtml hook to dynamically inject the Chop Shop / Excalibur Quantum 
 * overlay into the live DOM, and deploys the Aegis Frontend Shield at the very top of the head.
 */
export function unityAdminInjectorPlugin(): Plugin {
  return {
    name: 'vite-plugin-unity-admin',
    transformIndexHtml(html) {
      // 1. Inject Aegis Runtime Shield BEFORE the app loads (in the <head>)
      let injectedHtml = html.replace(
        '</head>',
        
          <!-- INJECTED BY UNITY: AEGIS SHIELD -->
          <script type="module" src="/src/plugins/unity-aegis-runtime.ts"></script>
        </head>
        
      );

      // 2. Inject the Chop Shop Basement App BEFORE the body closes
      injectedHtml = injectedHtml.replace(
        '</body>',
        
          <!-- INJECTED BY UNITY: BASEMENT ADMIN -->
          <div id="unity-admin-root"></div>
          <script type="module" src="/src/plugins/admin-mount.tsx"></script>
        </body>
        
      );

      return injectedHtml;
    }
  };
}
