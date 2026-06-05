export default function Icon({ nombre, size = 24, color = "294C74", style = {} }) {
  return (
    <img
      src={`https://img.icons8.com/ios/${size}/${color}/${nombre}.png`}
      alt={nombre}
      width={size}
      height={size}
      style={{objectFit: "contain", ...style}}
    />
  );
}