# Feellink App – Proyecto con React Native + ESP32 BLE

Este repositorio contiene la primera versión funcional de la app **Feellink**, desarrollada con **React Native + Expo** y conectada vía **Bluetooth Low Energy (BLE)** con un dispositivo ESP32. Esta versión permite establecer comunicación BLE y recibir datos simulados en tiempo real (presión, batería, movimiento).

---

## ✅ Tecnologías utilizadas

* React Native (con Expo SDK 53)
* TypeScript
* Bluetooth Low Energy (BLE) con `react-native-ble-plx`
* Conexión con ESP32 (Arduino / PlatformIO)
* Simulación de datos JSON enviados por BLE
* Generación de APK con `expo run:android`

---

## ⚙️ Instalación del proyecto (sin errores de dependencias)

1. Clona este repositorio:


2. Instala las dependencias con compatibilidad Expo:

```bash
npm install --legacy-peer-deps
```

🔧 Esto evitará errores con `react-native-ble-plx`, `bluetooth-state-manager`, y otras librerías nativas que usan `peerDependencies`.

3. Instala esbuild si no se instala automáticamente:

```bash
npm install --save-dev esbuild
```

> (Opcional, si usas Android Studio) Verifica que tengas **Java 17** y **Gradle actualizado**.

4. Genera el archivo `debug.keystore` ejecutando este comando en la terminal:

```bash
keytool -genkeypair -v -keystore android/app/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
```

---

## 📱 Cómo ejecutar la app en Android

1. Abre la terminal en **Visual Studio Code**
2. Ejecuta el siguiente comando para generar la carpeta `.android`:

```bash
npx expo run:android
```

3. Abre la carpeta `.android` desde **Android Studio**
4. Genera la APK desde "Build" dentro de **Android Studio**
5. Instala la APK generada en tu celular Android
6. Escanea el código QR con **Expo Go**
7. La app se abrirá y se conectará correctamente con la ESP32

> ✅ Importante: Expo Go por sí solo no soporta BLE, por eso es necesario tener la APK instalada previamente.

---

## ❗ Si obtienes el error:

```
INSTALL_FAILED_UPDATE_INCOMPATIBLE: Existing package com.anonymous.freelinkble signatures do not match newer version
```

Significa que ya tienes instalada una versión anterior de la app (con el mismo `applicationId`) firmada con una clave diferente.

### 🔐 ¿Por qué sucede?

Cuando generas un nuevo `debug.keystore`, esa clave no coincide con la que se usó en la APK anterior ya instalada, y Android no permite actualizar una app con una firma distinta.

### ✅ Solución:

✔ **Opción recomendada:** Desinstala la versión anterior de la app ejecutando:

```bash
adb uninstall com.anonymous.freelinkble
```

Luego vuelve a correr:

```bash
npx expo run:android
```

✅ Esto eliminará la versión antigua y te permitirá instalar la nueva sin conflictos.

---

## 🧠 Notas técnicas

* Los datos recibidos desde la ESP32 en esta versión son **simulados**, pero validan la estructura y comunicación BLE.
* Ya está configurado el entorno para usar BLE con Expo + esbuild.
* Se utiliza fragmentación manual de JSON para superar el límite de 20 bytes por paquete BLE.

---

## 📁 Estructura del proyecto

```
src/
  components/
    DeviceItem.tsx
    SensorDataView.tsx
  BluetoothScreen.tsx
  BluetoothManager.ts
```

---

## 👥 Organización del equipo

* Quienes tengan **Android Studio** apoyarán en la parte nativa (BLE + React Native)
* Quienes no puedan correr Android Studio trabajarán en el **prototipo web o interfaz tipo TV**


---

## 📚 Licencia

Este proyecto es parte de FeeLink del IDYGS91.
