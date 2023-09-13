import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

//texte génée à partir de: https://www.loremipzum.com/en/text-generator

function TermesConditionsPage() {
  const navigate = useNavigate();

  function Retourner() {
    navigate(-1);
  }
  return (
    <div className="container my-4">
      <h1 className="mb-4">Termes et Conditions</h1>
      <h3>1- Sed id ullamcorper eros</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac eleifend
        lectus. Sed consequat odio eu nulla commodo, vitae hendrerit lorem
        lobortis. Nulla tempor finibus velit, non pulvinar nisi. Maecenas vitae
        lorem non mi posuere tincidunt. Duis vitae mi nec velit consectetur
        venenatis. Sed malesuada tincidunt ipsum, vel finibus lacus bibendum ac.
        Nulla dignissim metus quis malesuada feugiat. Nam nec sapien et augue
        blandit congue. Curabitur ultrices ipsum sed augue ultricies, quis
        tristique magna commodo. Pellentesque vehicula nulla nec mi venenatis,
        nec pretium orci rhoncus. Donec tristique sapien eu nulla maximus
        rhoncus.
      </p>
      <h3>2- Eget commodo orci rutrum</h3>
      <p>
        Donec malesuada nulla nec leo ultrices mollis. Suspendisse convallis
        tellus non lorem hendrerit. Praesent sit amet pretium augue. Maecenas
        vel facilisis mauris. Sed ut mollis elit. Etiam euismod libero ut orci
        ultrices euismod. Nulla facilisi. Pellentesque id urna euismod,
        tincidunt purus sed, faucibus nibh. Praesent molestie nunc non dolor
        faucibus lacinia. Sed quis risus sed sapien vestibulum tincidunt.
        Suspendisse potenti. Fusce in imperdiet libero. Morbi sed mauris eget
        sem aliquet lobortis vel ut turpis. Suspendisse potenti. Nunc auctor
        dolor ut erat commodo blandit. Nam ut velit a tellus imperdiet egestas.
        Aliquam consequat, sapien nec faucibus scelerisque, odio est vehicula
        nulla, eu egestas elit elit nec elit.
        <strong>
          Non inventore non dolorem voluptatum et debitis quidem
        </strong>{" "}
      </p>
      <h3>3- Etiam fermentum ornare nulla at dictum</h3>
      <p>
        In tristique varius metus eu sollicitudin. Maecenas placerat turpis non
        dolor vestibulum, non dictum velit hendrerit. Duis elementum vel nisi
        nec ultricies. Praesent id ex euismod, malesuada velit sit amet,
        eleifend ipsum. Sed viverra, sapien eu egestas malesuada, sapien quam
        feugiat est, sed iaculis velit velit eget arcu. Nulla rhoncus ultrices
        lorem, in euismod quam auctor vel. Aliquam porttitor felis quis quam
        volutpat malesuada. Praesent molestie ipsum in libero efficitur, in
        aliquam nulla cursus. Donec tincidunt, libero at blandit lacinia, dolor
        sapien bibendum nibh, vitae placerat felis augue id metus.
      </p>
      <p>
        <p>
          Lorem ipsum dolor sit amet. Ut omnis similique aut fuga nobis{" "}
          <em>Quo corrupti</em>. Ea aliquam dignissimos{" "}
          <strong>
            In omnis et itaque provident et sint laboriosam cum voluptas
            eligendi
          </strong>{" "}
          id cupiditate aliquid eos dolorem repellat. Et harum exercitationem
          aut nobis distinctioAut perferendis ut veritatis corrupti sit quis
          numquam aut voluptatum sunt!{" "}
        </p>
        <ul>
          <li>Et sunt iste aut molestias magnam? </li>
          <li>Ut dicta architecto a totam dolorem. </li>
          <li>Et reprehenderit sunt ab cupiditate debitis! </li>
          <li>
            A iste illo est vero magni id quia praesentium qui voluptatem neque.{" "}
          </li>
          <li>A illum iusto ea deserunt dicta vel omnis quia. </li>
          <li>
            At ipsa omnis 33 molestiae nihil et nihil beatae quo quasi error.{" "}
          </li>
        </ul>
        <p>
          Ea esse culpa{" "}
          <em>Qui Quis et galisum doloribus ea explicabo eveniet</em> ut
          consequatur aliquid aut provident sint ex voluptatem praesentium. Hic
          minima quae At eaque consequaturEum distinctio et accusantium quia cum
          aperiam provident eum consequatur aspernatur. Vel omnis expedita et
          exercitationem autem ab exercitationem suscipit. Aut asperiores
          assumenda eos voluptatibus distinctioEt deleniti aut ullam deleniti
          eos vero commodi ea velit enim?{" "}
        </p>
      </p>
      <h3>4- Ea aliquam dignissimos</h3>
      <p>
        <ol>
          <li>Ut dolor quasi vel fugiat earum. </li>
          <li>Sed velit nesciunt At Quis voluptates. </li>
          <li>Qui maiores molestiae cum velit velit. </li>
          <li>In esse dolorem ut quia officia et magnam placeat. </li>
          <li>Eum alias ipsa et error rerum. </li>
          <li>
            Aut similique quidem qui ducimus dolorem qui optio commodi et nobis
            praesentium.{" "}
          </li>
        </ol>
        <p>
          In temporibus nihil ab nihil animiet aliquid rem laborum excepturi.
          Non vero beatae sit vitae voluptaset odit.{" "}
        </p>
        <p>
          Rem laboriosam aspernatur id galisum fugiat <em>Vel sunt</em>. Non
          explicabo itaque est perspiciatis pariaturut quae aut voluptatem
          accusantium ut dolores unde. In numquam unde et enim animi{" "}
          <strong>
            Quo possimus cum error atque aut mollitia dolorem est possimus sequi
          </strong>
          . Ab commodi minimaSed dolore ea quisquam deserunt aut molestiae
          consequatur sed maiores dolores et illum voluptatem!{" "}
        </p>
      </p>
      <Button variant="primary" onClick={Retourner}>
        Retourner
      </Button>
    </div>
  );
}
export default TermesConditionsPage;
