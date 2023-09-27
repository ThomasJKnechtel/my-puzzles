import Image from "next/image";

export default function LoadingIcon({progress}){
    const Parentdiv = {
        height: '10px',
        width: '300px',
        backgroundColor: 'whitesmoke',
        borderRadius: 40,
      }
      
      const Childdiv = {
        height: '100%',
        width: `${progress}%`,
        backgroundColor: "green",
       borderRadius:40,
        textAlign: 'right'
      }
      return (
        <div style={Parentdiv}>
          <div style={Childdiv}>
          </div>
        </div>
        )
}